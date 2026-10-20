import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { nanoid } from "nanoid";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { sendSuccess, ErrorCodes, createError } from "../../utils/response.js";
import {
  logoutSchema,
  refreshSchema,
  registerSchema,
  loginSchema,
} from "./auth.schema.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from "./auth.service.js";
import { prisma } from "../../database/client.js";
import {
  sendEmail,
  emailVerificationTemplate,
  passwordResetTemplate,
} from "../../services/email.js";
import { hashPassword } from "../../utils/password.js";
import { env } from "../../config/env.js";
import { consumeOtp, issueOtp, normalizeEmail } from "./otp.service.js";

/**
 * ثبت routeهای احراز هویت.
 */
export async function registerAuthRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/auth/register ───────────
  fastify.post(
    "/api/auth/register",
    {
      preHandler: validateBody(registerSchema),
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const input = request.body as Parameters<typeof registerUser>[0];
      const meta = {
        userAgent: request.headers["user-agent"],
        ipAddress: request.ip,
      };

      const result = await registerUser(input, meta);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: env.JWT_REFRESH_TTL,
      });

      // کد تأیید ایمیل؛ در پس‌زمینه ارسال می‌شود تا کندی/خطای ایمیل ثبت‌نام را نشکند.
      // (کاربر همیشه می‌تواند از «ارسال دوباره» استفاده کند.)
      void sendVerificationEmail(result.user.id, result.user.email, result.user.username);

      return sendSuccess(reply, { ...result, needsVerification: true }, 201);
    },
  );

  // ─── POST /api/auth/login ───────────────
  fastify.post(
    "/api/auth/login",
    {
      preHandler: validateBody(loginSchema),
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const input = request.body as Parameters<typeof loginUser>[0];
      const meta = {
        userAgent: request.headers["user-agent"],
        ipAddress: request.ip,
      };

      const result = await loginUser(input, meta);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: env.JWT_REFRESH_TTL,
      });

      return sendSuccess(reply, result);
    },
  );

  // ─── POST /api/auth/guest ───────────────
  fastify.post(
    "/api/auth/guest",
    {
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    async (_request, reply) => {
      // ساخت کاربر مهمان
      const guestId = nanoid(10);
      const guestEmail = `guest_${guestId}@lingo.guest`;

      const user = await prisma.user.create({
        data: {
          email: guestEmail,
          username: `guest_${guestId}`,
          passwordHash: "!guest_no_password!", // مهمان‌ها رمز ندارن
          role: "guest",
          status: "active",
          profile: {
            create: {
              level: "A1",
            },
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      });

      // ساخت توکن
      const { signAccessToken, signRefreshToken } = await import("../../utils/jwt.js");
      const accessToken = signAccessToken({ sub: user.id, role: user.role });
      const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000),
        },
      });

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: env.JWT_REFRESH_TTL,
      });

      return sendSuccess(reply, {
        user: { ...user, level: "A1" },
        accessToken,
        refreshToken,
      });
    },
  );

  // ─── POST /api/auth/refresh ─────────────
  fastify.post(
    "/api/auth/refresh",
    {
      preHandler: validateBody(refreshSchema),
    },
    async (request, reply) => {
      const { refreshToken: bodyToken } = request.body as { refreshToken?: string };
      const cookieToken = request.cookies.refresh_token;
      const refreshToken = cookieToken || bodyToken;

      if (!refreshToken) {
        throw createError(
          ErrorCodes.AUTH_REFRESH_INVALID.code,
          ErrorCodes.AUTH_REFRESH_INVALID.message,
          401,
        );
      }

      const meta = {
        userAgent: request.headers["user-agent"],
        ipAddress: request.ip,
      };

      const result = await refreshTokens(refreshToken, meta);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: env.JWT_REFRESH_TTL,
      });

      return sendSuccess(reply, result);
    },
  );

  // ─── POST /api/auth/logout ──────────────
  fastify.post(
    "/api/auth/logout",
    {
      preHandler: validateBody(logoutSchema),
    },
    async (request, reply) => {
      const body = (request.body as { refreshToken?: string }) ?? {};
      const cookieToken = request.cookies.refresh_token;
      const token = body.refreshToken || cookieToken;

      await logoutUser(token);
      reply.clearCookie("refresh_token", { path: "/api/auth" });

      return sendSuccess(reply, { success: true });
    },
  );

  // ─── GET /api/auth/me ───────────────────
  fastify.get(
    "/api/auth/me",
    { preHandler: authenticate },
    async (request, reply) => {
      const user = await getCurrentUser(request.user!.sub);
      return sendSuccess(reply, user);
    },
  );

  // ─── POST /api/auth/verify-email ────
  const verifyEmailSchema = z.object({
    code: z.string().regex(/^\d{6}$/, "کد باید ۶ رقم باشد."),
  });

  fastify.post(
    "/api/auth/verify-email",
    {
      preHandler: [authenticate, validateBody(verifyEmailSchema)],
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const { code } = request.body as { code: string };

      const user = await prisma.user.findUnique({
        where: { id: request.user!.sub },
        select: { email: true, isEmailVerified: true },
      });
      if (!user) {
        throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "کاربر یافت نشد.", 404);
      }
      if (user.isEmailVerified) {
        return sendSuccess(reply, { success: true, alreadyVerified: true });
      }

      const consumed = await consumeOtp({ email: user.email, type: "email_verification", code });
      if (!consumed) {
        throw createError("VERIFICATION_INVALID", "کد نامعتبر یا منقضی است. کد جدید بگیر و دوباره امتحان کن.", 400);
      }

      await prisma.user.update({
        where: { id: request.user!.sub },
        data: { isEmailVerified: true },
      });

      return sendSuccess(reply, { success: true });
    },
  );

  // ─── POST /api/auth/resend-verification ─
  fastify.post(
    "/api/auth/resend-verification",
    {
      preHandler: authenticate,
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: { id: request.user!.sub },
        select: { id: true, email: true, username: true, isEmailVerified: true },
      });

      if (!user) {
        throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "کاربر یافت نشد.", 404);
      }
      if (user.isEmailVerified) {
        return sendSuccess(reply, { success: true, alreadyVerified: true });
      }

      const outcome = await sendVerificationEmail(user.id, user.email, user.username);
      if (outcome.status === "cooldown") {
        throw createError(
          "OTP_COOLDOWN",
          `برای ارسال دوباره ${outcome.retryAfterSeconds} ثانیه صبر کن.`,
          429,
          { retryAfterSeconds: outcome.retryAfterSeconds },
        );
      }

      return sendSuccess(reply, { success: true, cooldownSeconds: 60 });
    },
  );

  // ─── POST /api/auth/forgot-password ────
  const forgotPasswordSchema = z.object({
    email: z.string().email("ایمیل نامعتبر است."),
  });

  fastify.post(
    "/api/auth/forgot-password",
    {
      preHandler: validateBody(forgotPasswordSchema),
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const { email } = request.body as { email: string };

      const user = await prisma.user.findUnique({
        where: { email: normalizeEmail(email) },
        select: { id: true, email: true },
      });

      // ضد user-enumeration: پاسخ و زمان پاسخ برای ایمیل موجود و ناموجود یکسان است
      // (ایمیل در پس‌زمینه ارسال می‌شود و cooldown هم بیرون نشان داده نمی‌شود).
      if (user) {
        void (async () => {
          const issued = await issueOtp({ userId: user.id, email: user.email, type: "password_reset" });
          if (issued.status === "issued") {
            await sendEmail(passwordResetTemplate(issued.code, user.email));
          }
        })().catch((err) => console.error("[FORGOT_PASSWORD_ERROR]", err));
      }

      return sendSuccess(reply, { success: true, cooldownSeconds: 60 });
    },
  );

  // ─── POST /api/auth/reset-password ─────
  const resetPasswordSchema = z.object({
    email: z.string().email("ایمیل نامعتبر است."),
    code: z.string().regex(/^\d{6}$/, "کد باید ۶ رقم باشد."),
    newPassword: z
      .string()
      .min(env.PASSWORD_MIN_LENGTH, `رمز باید حداقل ${env.PASSWORD_MIN_LENGTH} کاراکتر باشد.`)
      .max(128)
      .regex(/[a-z]/, "رمز باید حداقل یک حرف کوچک داشته باشد.")
      .regex(/[A-Z]/, "رمز باید حداقل یک حرف بزرگ داشته باشد.")
      .regex(/[0-9]/, "رمز باید حداقل یک عدد داشته باشد."),
  });

  fastify.post(
    "/api/auth/reset-password",
    {
      preHandler: validateBody(resetPasswordSchema),
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const { email, code, newPassword } = request.body as {
        email: string;
        code: string;
        newPassword: string;
      };

      const consumed = await consumeOtp({ email, type: "password_reset", code });
      if (!consumed || !consumed.userId) {
        throw createError("RESET_INVALID", "کد نامعتبر یا منقضی است. کد جدید بگیر و دوباره امتحان کن.", 400);
      }

      const passwordHash = await hashPassword(newPassword);
      await prisma.$transaction([
        // رسیدن کد به ایمیل، مالکیت ایمیل را هم ثابت می‌کند
        prisma.user.update({
          where: { id: consumed.userId },
          data: { passwordHash, isEmailVerified: true },
        }),
        // همه‌ی نشست‌های قبلی بسته می‌شوند (اگر کسی رمز را داشت، بیرون می‌افتد)
        prisma.refreshToken.updateMany({
          where: { userId: consumed.userId, revoked: false },
          data: { revoked: true },
        }),
      ]);

      reply.clearCookie("refresh_token", { path: "/api/auth" });
      return sendSuccess(reply, { success: true });
    },
  );
}

/** صدور و ارسال کد تأیید ایمیل. خطای ارسال لاگ می‌شود ولی throw نمی‌کند. */
async function sendVerificationEmail(
  userId: string,
  email: string,
  username: string,
): Promise<{ status: "sent" } | { status: "cooldown"; retryAfterSeconds: number }> {
  try {
    const issued = await issueOtp({ userId, email, type: "email_verification" });
    if (issued.status === "cooldown") return issued;
    await sendEmail(emailVerificationTemplate(issued.code, email, username));
  } catch (err) {
    console.error("[VERIFICATION_EMAIL_ERROR]", err);
  }
  return { status: "sent" };
}
