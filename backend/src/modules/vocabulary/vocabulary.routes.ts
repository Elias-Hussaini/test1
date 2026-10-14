import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import {
  addUserWordSchema,
  listMyWordsQuerySchema,
  updateUserWordSchema,
  type AddUserWordInput,
  type ListMyWordsQuery,
  type UpdateUserWordInput,
} from "./vocabulary.schema.js";
import {
  addUserWord,
  getMyVocabularyStats,
  listMyWords,
  removeUserWord,
  updateUserWord,
} from "./vocabulary.service.js";

/**
 * ثبت routeهای واژه‌نامه‌ی شخصی.
 * همه‌ی مسیرها نیاز به احراز هویت دارند.
 *
 * - GET    /api/vocabulary         — لیست واژه‌های کاربر
 * - POST   /api/vocabulary         — افزودن واژه
 * - PATCH  /api/vocabulary/:wordId — به‌روزرسانی وضعیت
 * - DELETE /api/vocabulary/:wordId — حذف واژه
 * - GET    /api/vocabulary/stats   — آمار
 */
export async function registerVocabularyRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── GET /api/vocabulary ────────────────
  fastify.get(
    "/api/vocabulary",
    {
      preHandler: [authenticate, validateQuery(listMyWordsQuerySchema)],
    },
    async (request, reply) => {
      const query = request.query as ListMyWordsQuery;
      const result = await listMyWords(request.user!.sub, query);
      return sendSuccess(reply, result);
    },
  );

  // ─── POST /api/vocabulary ───────────────
  fastify.post(
    "/api/vocabulary",
    {
      preHandler: [authenticate, validateBody(addUserWordSchema)],
    },
    async (request, reply) => {
      const input = request.body as AddUserWordInput;
      const result = await addUserWord(request.user!.sub, input);
      return sendSuccess(reply, result, 201);
    },
  );

  // ─── PATCH /api/vocabulary/:wordId ──────
  fastify.patch(
    "/api/vocabulary/:wordId",
    {
      preHandler: [
        authenticate,
        validateParams(z.object({ wordId: z.string().uuid() })),
        validateBody(updateUserWordSchema),
      ],
    },
    async (request, reply) => {
      const { wordId } = request.params as { wordId: string };
      const input = request.body as UpdateUserWordInput;
      const result = await updateUserWord(request.user!.sub, wordId, input);
      return sendSuccess(reply, result);
    },
  );

  // ─── DELETE /api/vocabulary/:wordId ─────
  fastify.delete(
    "/api/vocabulary/:wordId",
    {
      preHandler: [authenticate, validateParams(z.object({ wordId: z.string().uuid() }))],
    },
    async (request, reply) => {
      const { wordId } = request.params as { wordId: string };
      await removeUserWord(request.user!.sub, wordId);
      return sendSuccess(reply, { success: true });
    },
  );

  // ─── GET /api/vocabulary/stats ──────────
  fastify.get(
    "/api/vocabulary/stats",
    { preHandler: authenticate },
    async (request, reply) => {
      const stats = await getMyVocabularyStats(request.user!.sub);
      return sendSuccess(reply, stats);
    },
  );
}
