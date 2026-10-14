import { prisma } from "../../database/client.js";
import { createError, ErrorCodes } from "../../utils/response.js";
import type { CreateWordInput, SearchWordsQuery, UpdateWordInput } from "./dictionary.schema.js";

/**
 * ساخت یک واژه‌ی جدید.
 * - بررسی تکراری نبودن (german + article)
 */
export async function createWord(input: CreateWordInput) {
  const article = input.article ?? "";
  const existing = await prisma.word.findUnique({
    where: { german_article: { german: input.german, article } },
    select: { id: true },
  }).catch(() => null);

  if (existing) {
    throw createError(
      ErrorCodes.RESOURCE_CONFLICT.code,
      "این واژه قبلاً وجود دارد.",
      409,
    );
  }

  return prisma.word.create({
    data: {
      german: input.german,
      persian: input.persian,
      article: input.article ?? null,
      plural: input.plural,
      partOfSpeech: input.partOfSpeech,
      level: input.level,
      example: input.example,
      exampleFa: input.exampleFa,
      ipa: input.ipa,
      audioUrl: input.audioUrl,
    },
  });
}

/**
 * به‌روزرسانی واژه.
 */
export async function updateWord(id: string, input: UpdateWordInput) {
  // اطمینان از وجود واژه
  const exists = await prisma.word.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "واژه یافت نشد.", 404);
  }
  return prisma.word.update({ where: { id }, data: input });
}

/**
 * حذف واژه.
 */
export async function deleteWord(id: string): Promise<void> {
  const exists = await prisma.word.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "واژه یافت نشد.", 404);
  }
  await prisma.word.delete({ where: { id } });
}

/**
 * جستجوی واژه‌ها با فیلتر و pagination.
 */
export async function searchWords(query: SearchWordsQuery) {
  const page = query.page ?? 1;
  const limit = Math.min(100, query.limit ?? 20);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (query.q) {
    where.OR = [
      { german: { contains: query.q } },
      { persian: { contains: query.q } },
    ];
  }
  if (query.level) where.level = query.level;
  if (query.article) where.article = query.article;
  if (query.partOfSpeech) where.partOfSpeech = query.partOfSpeech;

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      skip,
      take: limit,
      orderBy: { german: "asc" },
    }),
    prisma.word.count({ where }),
  ]);

  return {
    words,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * گرفتن یک واژه با id.
 */
export async function getWord(id: string) {
  const word = await prisma.word.findUnique({ where: { id } });
  if (!word) {
    throw createError(ErrorCodes.RESOURCE_NOT_FOUND.code, "واژه یافت نشد.", 404);
  }
  return word;
}
