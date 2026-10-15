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

/**
 * (ادمین) جزئیات یک کاربر.
 */
export async function adminGetUser(userId: string) {
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
      createdAt: true,
      updatedAt: true,
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
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "کاربر یافت نشد.", 404);
  }

  const [savedWords, learnedWords, sessions] = await Promise.all([
    prisma.userWord.count({ where: { userId } }),
    prisma.userWord.count({ where: { userId, status: "learned" } }),
    prisma.session.count({ where: { userId } }),
  ]);

  return {
    ...user,
    stats: {
      savedWords,
      learnedWords,
      learningWords: savedWords - learnedWords,
      sessions,
    },
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * (ادمین) آمار کلی داشبورد.
 * تعداد‌ها با کوئری‌های شمارشی از کل دیتابیس گرفته می‌شود
 * (نه از یک صفحه‌ی محدود از لیست کاربران).
 */
export async function adminGetStats() {
  const now = Date.now();
  const since7 = new Date(now - 7 * DAY_MS);
  const since14 = new Date(now - 13 * DAY_MS);
  since14.setUTCHours(0, 0, 0, 0);

  const [
    usersTotal,
    verified,
    newLast7Days,
    byStatus,
    byRole,
    wordsTotal,
    wordsByLevel,
    savedWords,
    learnedWords,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isEmailVerified: true } }),
    prisma.user.count({ where: { createdAt: { gte: since7 } } }),
    prisma.user.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.word.count(),
    prisma.word.groupBy({ by: ["level"], _count: { _all: true } }),
    prisma.userWord.count(),
    prisma.userWord.count({ where: { status: "learned" } }),
    prisma.user.findMany({
      where: { createdAt: { gte: since14 } },
      select: { createdAt: true },
    }),
  ]);

  const toMap = (rows: Array<{ key: string; count: number }>): Record<string, number> =>
    Object.fromEntries(rows.map((r) => [r.key, r.count]));

  // ثبت‌نام‌های ۱۴ روز اخیر (UTC)، با صفر برای روزهای خالی
  const buckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    buckets.set(new Date(now - i * DAY_MS).toISOString().slice(0, 10), 0);
  }
  for (const u of recentSignups) {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const status = toMap(byStatus.map((r) => ({ key: r.status, count: r._count._all })));

  return {
    users: {
      total: usersTotal,
      active: status.active ?? 0,
      blocked: status.blocked ?? 0,
      suspended: status.suspended ?? 0,
      verified,
      newLast7Days,
      byRole: toMap(byRole.map((r) => ({ key: r.role, count: r._count._all }))),
    },
    words: {
      total: wordsTotal,
      byLevel: toMap(wordsByLevel.map((r) => ({ key: r.level, count: r._count._all }))),
    },
    learning: {
      savedWords,
      learnedWords,
    },
    signups: Array.from(buckets, ([date, count]) => ({ date, count })),
  };
}
