import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate.middleware.js";
import { createError, ErrorCodes, sendSuccess } from "../../utils/response.js";
import {
  adminGetStats,
  adminGetUser,
  adminListUsers,
  adminUpdateUser,
  getMyStats,
  getPublicProfile,
  updateMyProfile,
} from "./users.service.js";
import {
  updateProfileSchema,
  updateUserSchema,
} from "./users.schema.js";

/**
 * مسیرهای کاربران.
 * مسیرهای مدیریتی با پیشوند /api/admin هستند.
 */
export async function registerUsersRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── GET /api/users/me ─────────────────────
  fastify.get(
    "/api/users/me",
    { preHandler: authenticate },
    async (request, reply) => {
      const stats = await getMyStats(request.user!.sub);
      return sendSuccess(reply, stats);
    },
  );

  // ─── PATCH /api/users/me/profile ──────────
  fastify.patch(
    "/api/users/me/profile",
    {
      preHandler: [authenticate, validateBody(updateProfileSchema)],
    },
    async (request, reply) => {
      const input = request.body as z.infer<typeof updateProfileSchema>;
      const updated = await updateMyProfile(request.user!.sub, input);
      return sendSuccess(reply, updated);
    },
  );

  // ─── GET /api/users/:id ───────────────────
  fastify.get(
    "/api/users/:id",
    {
      preHandler: [
        authenticate,
        validateParams(z.object({ id: z.string().uuid() })),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const profile = await getPublicProfile(id);
      return sendSuccess(reply, profile);
    },
  );

  // ─── (ادمین) GET /api/admin/users ─────────
  const listUsersQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().max(100).optional(),
    status: z.enum(["active", "blocked", "suspended"]).optional(),
    role: z.enum(["user", "guest", "premium", "admin"]).optional(),
  });

  fastify.get(
    "/api/admin/users",
    {
      preHandler: [
        authenticate,
        requireRole("admin"),
        validateQuery(listUsersQuerySchema),
      ],
    },
    async (request, reply) => {
      const query = request.query as z.infer<typeof listUsersQuerySchema>;
      const result = await adminListUsers(query);
      return sendSuccess(reply, result);
    },
  );

  // ─── (ادمین) GET /api/admin/stats ─────────
  fastify.get(
    "/api/admin/stats",
    { preHandler: [authenticate, requireRole("admin")] },
    async (_request, reply) => {
      const stats = await adminGetStats();
      return sendSuccess(reply, stats);
    },
  );

  // ─── (ادمین) GET /api/admin/users/:id ─────
  fastify.get(
    "/api/admin/users/:id",
    {
      preHandler: [
        authenticate,
        requireRole("admin"),
        validateParams(z.object({ id: z.string().uuid() })),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = await adminGetUser(id);
      return sendSuccess(reply, user);
    },
  );

  // ─── (ادمین) PATCH /api/admin/users/:id ────
  fastify.patch(
    "/api/admin/users/:id",
    {
      preHandler: [
        authenticate,
        requireRole("admin"),
        validateParams(z.object({ id: z.string().uuid() })),
        validateBody(updateUserSchema),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const input = request.body as z.infer<typeof updateUserSchema>;

      // جلوگیری از قفل‌شدن: ادمین نمی‌تواند نقش یا وضعیت حساب خودش را تغییر دهد
      if (
        id === request.user!.sub &&
        (input.role !== undefined || input.status !== undefined)
      ) {
        throw createError(
          ErrorCodes.AUTH_FORBIDDEN.code,
          "نقش یا وضعیت حساب خودت را نمی‌توانی تغییر بدهی.",
          403,
        );
      }

      const updated = await adminUpdateUser(id, input);
      return sendSuccess(reply, updated);
    },
  );
}
