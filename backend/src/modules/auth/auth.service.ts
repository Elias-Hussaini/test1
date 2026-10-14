import { prisma } from "../../database/client.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from "../../utils/jwt.js";
import { createError, ErrorCodes } from "../../utils/response.js";
import { env } from "../../config/env.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

/**
 * ساخت جفت Access + Refresh Token و ذخیره‌ی Refresh در DB.
 */
async function issueTokens(
  user: { id: string; role: string },
  _requestMeta: { userAgent?: string; ipAddress?: string },
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { sub: user.id, role: user.role } as const;

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // ذخیره‌ی Refresh Token در DB برای قابلیت revoke
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000),
    },
  });

  return { accessToken, refreshToken };
}

/**
 * ثبت‌نام کاربر جدید.
 */
export async function registerUser(
  input: RegisterInput,
  requestMeta: { userAgent?: string; ipAddress?: string },
): Promise<{
  user: { id: string; email: string; username: string; role: string };
  accessToken: string;
  refreshToken: string;
}> {
  // بررسی یکتایی ایمیل
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true },
  });
  if (existingEmail) {
    throw createError(
      ErrorCodes.AUTH_EMAIL_TAKEN.code,
      ErrorCodes.AUTH_EMAIL_TAKEN.message,
      409,
    );
  }

  // بررسی یکتایی username
  const existingUsername = await prisma.user.findUnique({
    where: { username: input.username },
    select: { id: true },
  });
  if (existingUsername) {
    throw createError(
      ErrorCodes.AUTH_USERNAME_TAKEN.code,
      ErrorCodes.AUTH_USERNAME_TAKEN.message,
      409,
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      username: input.username,
      passwordHash,
      role: "user",
      profile: {
        create: {
          firstName: input.firstName ?? null,
          lastName: input.lastName ?? null,
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

  const tokens = await issueTokens(user, requestMeta);

  return {
    user: { id: user.id, email: user.email, username: user.username, role: user.role },
    ...tokens,
  };
}

/**
 * ورود کاربر موجود.
 */
export async function loginUser(
  input: LoginInput,
  requestMeta: { userAgent?: string; ipAddress?: string },
): Promise<{
  user: { id: string; email: string; username: string; role: string; level: string };
  accessToken: string;
  refreshToken: string;
}> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      passwordHash: true,
      profile: { select: { level: true } },
    },
  });

  if (!user) {
    throw createError(
      ErrorCodes.AUTH_INVALID_CREDENTIALS.code,
      ErrorCodes.AUTH_INVALID_CREDENTIALS.message,
      401,
    );
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash);
  if (!passwordValid) {
    throw createError(
      ErrorCodes.AUTH_INVALID_CREDENTIALS.code,
      ErrorCodes.AUTH_INVALID_CREDENTIALS.message,
      401,
    );
  }

  if (user.status === "blocked") {
    throw createError(
      ErrorCodes.AUTH_USER_BLOCKED.code,
      ErrorCodes.AUTH_USER_BLOCKED.message,
      403,
    );
  }
  if (user.status === "suspended") {
    throw createError("AUTH_USER_SUSPENDED", "حساب شما موقتاً معلق شده است.", 403);
  }

  const tokens = await issueTokens(user, requestMeta);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      level: user.profile?.level ?? "A1",
    },
    ...tokens,
  };
}

/**
 * تجدید Access Token با Refresh Token.
 * - Refresh Token باید در DB موجود و نشده-revoke باشد.
 * - rotation: در هر بار، توکن قبلی revoke می‌شود.
 */
export async function refreshTokens(
  refreshToken: string,
  requestMeta: { userAgent?: string; ipAddress?: string },
): Promise<{
  user: { id: string; role: string };
  accessToken: string;
  refreshToken: string;
}> {
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw createError(
      ErrorCodes.AUTH_REFRESH_INVALID.code,
      ErrorCodes.AUTH_REFRESH_INVALID.message,
      401,
    );
  }

  if (payload.type !== "refresh") {
    throw createError(
      ErrorCodes.AUTH_REFRESH_INVALID.code,
      ErrorCodes.AUTH_REFRESH_INVALID.message,
      401,
    );
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    select: { id: true, revoked: true, expiresAt: true, userId: true },
  });

  if (!stored || stored.revoked) {
    throw createError(
      ErrorCodes.AUTH_REFRESH_INVALID.code,
      ErrorCodes.AUTH_REFRESH_INVALID.message,
      401,
    );
  }

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw createError(
      ErrorCodes.AUTH_TOKEN_EXPIRED.code,
      ErrorCodes.AUTH_TOKEN_EXPIRED.message,
      401,
    );
  }

  // rotation
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
    select: { id: true, role: true, status: true },
  });
  if (!user || user.status !== "active") {
    throw createError(
      ErrorCodes.AUTH_USER_BLOCKED.code,
      ErrorCodes.AUTH_USER_BLOCKED.message,
      403,
    );
  }

  const tokens = await issueTokens(user, requestMeta);

  return {
    user: { id: user.id, role: user.role },
    ...tokens,
  };
}

/**
 * خروج — revoke کردن Refresh Token.
 */
export async function logoutUser(refreshToken?: string): Promise<void> {
  if (!refreshToken) return;

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, revoked: false },
    data: { revoked: true },
  });
}

/**
 * گرفتن اطلاعات کاربر فعلی.
 */
export async function getCurrentUser(userId: string): Promise<{
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    level: string;
    xp: number;
    streak: number;
  } | null;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      isEmailVerified: true,
      avatarUrl: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          bio: true,
          level: true,
          xp: true,
          streak: true,
        },
      },
    },
  });

  if (!user) {
    throw createError(
      ErrorCodes.RESOURCE_NOT_FOUND.code,
      "کاربر یافت نشد.",
      404,
    );
  }

  return user;
}
