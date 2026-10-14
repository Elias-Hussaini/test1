import { z } from "zod";

/**
 * Schema برای افزودن واژه به واژه‌نامه‌ی شخصی کاربر.
 */
export const addUserWordSchema = z.object({
  wordId: z.string().uuid("شناسه‌ی واژه نامعتبر است."),
  status: z.enum(["learning", "learned", "unknown"]).default("learning"),
});

export type AddUserWordInput = z.infer<typeof addUserWordSchema>;

export const updateUserWordSchema = z.object({
  status: z.enum(["learning", "learned", "unknown"]),
});

export type UpdateUserWordInput = z.infer<typeof updateUserWordSchema>;

export const listMyWordsQuerySchema = z.object({
  status: z.enum(["learning", "learned", "unknown"]).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type ListMyWordsQuery = z.infer<typeof listMyWordsQuerySchema>;
