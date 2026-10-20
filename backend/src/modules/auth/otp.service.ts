import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "../../database/client.js";
import { env } from "../../config/env.js";

/**
 * کدهای یک‌بارمصرف ایمیل (تأیید ایمیل و بازیابی رمز).
 *
 * - کد با randomInt (CSPRNG) ساخته می‌شود، نه Math.random.
 * - فقط HMAC کد ذخیره می‌شود؛ با لو رفتن دیتابیس، کد قابل بازیابی نیست
 *   (کلید HMAC در env است و فضای ۶ رقمی بدون کلید قابل brute-force نیست).
 * - کد همیشه به ایمیل مشخص گره خورده؛ هیچ‌وقت «فقط با کد» چیزی تأیید نمی‌شود.
 * - هر کد حداکثر ۵ حدس می‌پذیرد، ۱۰ دقیقه اعتبار دارد و فقط یک بار مصرف می‌شود.
 * - با صدور کد جدید، کدهای قبلیِ همان ایمیل و نوع باطل می‌شوند.
 */

export type OtpType = "email_verification" | "password_reset";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashCode(type: OtpType, email: string, code: string): Buffer {
  return createHmac("sha256", env.JWT_REFRESH_SECRET).update(`otp:${type}:${email}:${code}`).digest();
}

export type IssueResult =
  | { status: "issued"; code: string }
  | { status: "cooldown"; retryAfterSeconds: number };

export async function issueOtp(params: {
  userId: string | null;
  email: string;
  type: OtpType;
}): Promise<IssueResult> {
  const email = normalizeEmail(params.email);
  const { type } = params;

  const latest = await prisma.verificationCode.findFirst({
    where: { email, type },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  if (latest) {
    const elapsed = Date.now() - latest.createdAt.getTime();
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      return { status: "cooldown", retryAfterSeconds: Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000) };
    }
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");

  await prisma.$transaction([
    prisma.verificationCode.updateMany({ where: { email, type, used: false }, data: { used: true } }),
    prisma.verificationCode.create({
      data: {
        userId: params.userId,
        email,
        type,
        codeHash: hashCode(type, email, code).toString("hex"),
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    }),
  ]);

  return { status: "issued", code };
}

/**
 * بررسی و مصرف کد. در همه‌ی حالت‌های شکست `null` برمی‌گردد
 * (نامعتبر، منقضی، مصرف‌شده، حدس‌های زیاد) تا از بیرون قابل تشخیص نباشد.
 */
export async function consumeOtp(params: {
  email: string;
  type: OtpType;
  code: string;
}): Promise<{ userId: string | null } | null> {
  const email = normalizeEmail(params.email);
  const { type, code } = params;

  const record = await prisma.verificationCode.findFirst({
    where: { email, type, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return null;

  // اول حدس را بشمار (اتمیک)، بعد مقایسه کن؛ هم‌زمانی نمی‌تواند سقف حدس‌ها را دور بزند.
  const counted = await prisma.verificationCode.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
    select: { attempts: true },
  });
  if (counted.attempts > OTP_MAX_ATTEMPTS) {
    await prisma.verificationCode.updateMany({ where: { id: record.id }, data: { used: true } });
    return null;
  }

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = hashCode(type, email, code);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    if (counted.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.verificationCode.updateMany({ where: { id: record.id }, data: { used: true } });
    }
    return null;
  }

  // مصرف اتمیک: اگر دو درخواست هم‌زمان کد درست بفرستند فقط یکی برنده می‌شود.
  const claimed = await prisma.verificationCode.updateMany({
    where: { id: record.id, used: false },
    data: { used: true },
  });
  if (claimed.count !== 1) return null;

  return { userId: record.userId };
}
