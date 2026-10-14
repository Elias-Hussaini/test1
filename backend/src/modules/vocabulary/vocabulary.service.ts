import { prisma } from "../../database/client.js";
import { createError, ErrorCodes } from "../../utils/response.js";
import type {
  AddUserWordInput,
  ListMyWordsQuery,
  UpdateUserWordInput,
} from "./vocabulary.schema.js";

/**
 * افزودن واژه به واژه‌نامه‌ی شخصی کاربر.
 * - اگه قبلاً اضافه شده، فقط status را به‌روزرسانی می‌کند.
 */
export async function addUserWord(userId: string, input: AddUserWordInput) {
  // بررسی وجود واژه
  const word = await prisma.word.findUnique({
    where: { id: input.wordId },
    select: { id: true },
  });
  if (!word) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "واژه یافت نشد.", 404);
  }

  // upsert: اگه هست، به‌روزرسانی کن؛ وگرنه بساز
  return prisma.userWord.upsert({
    where: {
      userId_wordId: { userId, wordId: input.wordId },
    },
    update: { status: input.status },
    create: {
      userId,
      wordId: input.wordId,
      status: input.status,
    },
    include: {
      word: {
        select: {
          id: true,
          german: true,
          persian: true,
          article: true,
          plural: true,
          level: true,
          partOfSpeech: true,
          ipa: true,
          audioUrl: true,
        },
      },
    },
  });
}

/**
 * حذف واژه از واژه‌نامه‌ی شخصی.
 */
export async function removeUserWord(userId: string, wordId: string): Promise<void> {
  const existing = await prisma.userWord.findUnique({
    where: { userId_wordId: { userId, wordId } },
    select: { id: true },
  });
  if (!existing) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "این واژه در واژه‌نامه‌ی شما نیست.", 404);
  }
  await prisma.userWord.delete({ where: { id: existing.id } });
}

/**
 * به‌روزرسانی وضعیت یک واژه‌ی ذخیره‌شده.
 */
export async function updateUserWord(
  userId: string,
  wordId: string,
  input: UpdateUserWordInput,
) {
  const existing = await prisma.userWord.findUnique({
    where: { userId_wordId: { userId, wordId } },
    select: { id: true },
  });
  if (!existing) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "این واژه در واژه‌نامه‌ی شما نیست.", 404);
  }

  return prisma.userWord.update({
    where: { id: existing.id },
    data: { status: input.status },
    include: {
      word: {
        select: {
          id: true,
          german: true,
          persian: true,
          article: true,
          plural: true,
          level: true,
          partOfSpeech: true,
          ipa: true,
          audioUrl: true,
        },
      },
    },
  });
}

/**
 * لیست واژه‌های ذخیره‌شده‌ی کاربر با فیلتر و pagination.
 */
export async function listMyWords(userId: string, query: ListMyWordsQuery) {
  const page = query.page ?? 1;
  const limit = Math.min(100, query.limit ?? 20);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId };
  if (query.status) where.status = query.status;
  if (query.level) where.word = { level: query.level };

  const [items, total] = await Promise.all([
    prisma.userWord.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        word: {
          select: {
            id: true,
            german: true,
            persian: true,
            article: true,
            plural: true,
            level: true,
            partOfSpeech: true,
            ipa: true,
            audioUrl: true,
            example: true,
            exampleFa: true,
          },
        },
      },
    }),
    prisma.userWord.count({ where }),
  ]);

  return {
    words: items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * آمار واژه‌نامه‌ی کاربر (برای dashboard).
 */
export async function getMyVocabularyStats(userId: string) {
  const [total, learning, learned, unknown] = await Promise.all([
    prisma.userWord.count({ where: { userId } }),
    prisma.userWord.count({ where: { userId, status: "learning" } }),
    prisma.userWord.count({ where: { userId, status: "learned" } }),
    prisma.userWord.count({ where: { userId, status: "unknown" } }),
  ]);

  return { total, learning, learned, unknown };
}
