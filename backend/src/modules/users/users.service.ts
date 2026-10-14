import { prisma } from "../../database/client.js";
import { createError, ErrorCodes } from "../../utils/response.js";
import type { UpdateProfileInput, UpdateUserInput } from "./users.schema.js";

/**
 * به‌روزرسانی پروفایل خود کاربر.
 */
export async function updateMyProfile(userId: string, input: UpdateProfileInput) {
  const updated = await prisma.profile.update({
    where: { userId },
    data: {
      ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
      ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
      ...(input.bio !== undefined ? { bio: input.bio } : {}),
      ...(input.level !== undefined ? { level: input.level } : {}),
    },
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      level: true,
      xp: true,
      streak: true,
    },
  });

  if (input.avatarUrl !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: input.avatarUrl },
    });
  }

  return updated;
}

/**
 * گرفتن پروفایل عمومی کاربر.
 */
export async function getPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      avatarUrl: true,
      createdAt: true,
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

  if (!user || user.status !== "active") {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "کاربر یافت نشد.", 404);
  }

  return user;
}

/**
 * آمار کاربر فعلی (برای dashboard).
 */
export async function getMyStats(userId: string) {
  const [profile, wordsCount, learnedCount, sessionsCount] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.userWord.count({ where: { userId } }),
    prisma.userWord.count({ where: { userId, status: "learned" } }),
    prisma.session.count({ where: { userId } }),
  ]);

  return {
    level: profile?.level ?? "A1",
    xp: profile?.xp ?? 0,
    streak: profile?.streak ?? 0,
    words: {
      total: wordsCount,
      learned: learnedCount,
      learning: wordsCount - learnedCount,
    },
    sessions: sessionsCount,
  };
}

/**
 * (ادمین) به‌روزرسانی کاربر.
 */
export async function adminUpdateUser(userId: string, input: UpdateUserInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "کاربر یافت نشد.", 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.isEmailVerified !== undefined
        ? { isEmailVerified: input.isEmailVerified }
        : {}),
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      isEmailVerified: true,
    },
  });
}

/**
 * (ادمین) لیست کاربران.
 */
export async function adminListUsers(opts: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (opts.status) where.status = opts.status;
  if (opts.role) where.role = opts.role;
  if (opts.search) {
    where.OR = [
      { email: { contains: opts.search } },
      { username: { contains: opts.search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        isEmailVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            level: true,
            xp: true,
            streak: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
