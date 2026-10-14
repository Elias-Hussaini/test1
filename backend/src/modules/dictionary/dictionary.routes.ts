import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import {
  createWordSchema,
  searchWordsQuerySchema,
  updateWordSchema,
  type CreateWordInput,
  type SearchWordsQuery,
  type UpdateWordInput,
} from "./dictionary.schema.js";
import {
  createWord,
  deleteWord,
  getWord,
  searchWords,
  updateWord,
} from "./dictionary.service.js";

/**
 * ثبت routeهای دیکشنری.
 * - GET /api/dictionary/search — عمومی
 * - GET /api/dictionary/word/:id — عمومی
 * - POST /api/admin/dictionary — ادمین
 * - PATCH /api/admin/dictionary/:id — ادمین
 * - DELETE /api/admin/dictionary/:id — ادمین
 */
export async function registerDictionaryRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── GET /api/dictionary/search ─────────
  fastify.get(
    "/api/dictionary/search",
    { preHandler: validateQuery(searchWordsQuerySchema) },
    async (request, reply) => {
      const query = request.query as SearchWordsQuery;
      const result = await searchWords(query);
      return sendSuccess(reply, result);
    },
  );

  // ─── GET /api/dictionary/word/:id ────────
  fastify.get(
    "/api/dictionary/word/:id",
    {
      preHandler: validateParams(z.object({ id: z.string().uuid() })),
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const word = await getWord(id);
      return sendSuccess(reply, word);
    },
  );

  // ─── (ادمین) POST /api/admin/dictionary ──
  fastify.post(
    "/api/admin/dictionary",
    {
      preHandler: [authenticate, requireRole("admin"), validateBody(createWordSchema)],
    },
    async (request, reply) => {
      const input = request.body as CreateWordInput;
      const word = await createWord(input);
      return sendSuccess(reply, word, 201);
    },
  );

  // ─── (ادمین) PATCH /api/admin/dictionary/:id
  fastify.patch(
    "/api/admin/dictionary/:id",
    {
      preHandler: [
        authenticate,
        requireRole("admin"),
        validateParams(z.object({ id: z.string().uuid() })),
        validateBody(updateWordSchema),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const input = request.body as UpdateWordInput;
      const word = await updateWord(id, input);
      return sendSuccess(reply, word);
    },
  );

  // ─── (ادمین) DELETE /api/admin/dictionary/:id
  fastify.delete(
    "/api/admin/dictionary/:id",
    {
      preHandler: [
        authenticate,
        requireRole("admin"),
        validateParams(z.object({ id: z.string().uuid() })),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await deleteWord(id);
      return sendSuccess(reply, { success: true });
    },
  );
}
