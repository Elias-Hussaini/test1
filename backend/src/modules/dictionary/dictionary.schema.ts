import { z } from "zod";

export const createWordSchema = z.object({
  german: z.string().min(1, " واژه آلمانی الزامی است.").max(100),
  persian: z.string().min(1, "ترجمه فارسی الزامی است.").max(100),
  article: z.enum(["der", "die", "das"]).nullable().optional(),
  plural: z.string().max(100).optional(),
  partOfSpeech: z
    .enum(["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction"])
    .optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).default("A1"),
  example: z.string().max(500).optional(),
  exampleFa: z.string().max(500).optional(),
  ipa: z.string().max(100).optional(),
  audioUrl: z.string().url().optional(),
});

export type CreateWordInput = z.infer<typeof createWordSchema>;

export const updateWordSchema = createWordSchema.partial();
export type UpdateWordInput = z.infer<typeof updateWordSchema>;

export const searchWordsQuerySchema = z.object({
  q: z.string().max(100).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  article: z.enum(["der", "die", "das"]).optional(),
  partOfSpeech: z
    .enum(["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction"])
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type SearchWordsQuery = z.infer<typeof searchWordsQuerySchema>;
