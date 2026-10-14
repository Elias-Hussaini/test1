import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { sendSuccess, ErrorCodes, createError } from "../../utils/response.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "./auth.schema.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from "./auth.service.js";

/**
 * ثبت routeهای احراز هویت.
 * همه‌ی مسیرها با پیشوند /api/auth هستند.
 */
export async function registerAuthRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/auth/register ───────────
  fastify.post(
    "/api/auth/register",
    {
      preHandler: validateBody(registerSchema),
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const input = request.body as Parameters<typeof registerUser>[0];
      const meta = {
        userAgent: request.headers["user-agent"],
        ipAddress: request.ip,
      };

      const result = await registerUser(input, meta);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: 60 * 60 * 24 * 7,
      });

      return sendSuccess(reply, result, 201);
    },
  );

  // ─── POST /api/auth/login ───────────────
  fastify.post(
    "/api/auth/login",
    {
      preHandler: validateBody(loginSchema),
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const input = request.body as Parameters<typeof loginUser>[0];
      const meta = {
        userAgent: request.headers["user-agent"],
        ipAddress: request.ip,
      };

      const result = await loginUser(input, meta);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: 60 * 60 * 24 * 7,
      });

      return sendSuccess(reply, result);
    },
  );

  // ─── POST /api/auth/refresh ─────────────
  fastify.post(
    "/api/auth/refresh",
    {
      preHandler: validateBody(refreshSchema),
    },
    async (request, reply) => {
      const { refreshToken: bodyToken } = request.body as { refreshToken: string };
      const cookieToken = request.cookies.refresh_token;
      const refreshToken = cookieToken || bodyToken;

      if (!refreshToken) {
        throw createError(
          ErrorCodes.AUTH_REFRESH_INVALID.code,
          ErrorCodes.AUTH_REFRESH_INVALID.message,
          401,
        );
      }

      const meta = {
        userAgent: request.headers["user-agent"],
        ipAddress: request.ip,
      };

      const result = await refreshTokens(refreshToken, meta);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: 60 * 60 * 24 * 7,
      });

      return sendSuccess(reply, result);
    },
  );

  // ─── POST /api/auth/logout ──────────────
  fastify.post(
    "/api/auth/logout",
    {
      preHandler: validateBody(logoutSchema),
    },
    async (request, reply) => {
      const body = (request.body as { refreshToken?: string }) ?? {};
      const cookieToken = request.cookies.refresh_token;
      const token = body.refreshToken || cookieToken;

      await logoutUser(token);
      reply.clearCookie("refresh_token", { path: "/api/auth" });

      return sendSuccess(reply, { success: true });
    },
  );

  // ─── GET /api/auth/me ───────────────────
  fastify.get(
    "/api/auth/me",
    { preHandler: authenticate },
    async (request, reply) => {
      const user = await getCurrentUser(request.user!.sub);
      return sendSuccess(reply, user);
    },
  );
}
