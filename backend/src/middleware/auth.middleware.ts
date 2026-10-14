import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../utils/jwt.js";
import { createError, ErrorCodes } from "../utils/response.js";

/**
 * استخراج و بررسی Access Token از هدر Authorization.
 * در صورت موفقیت، `request.user` را پر می‌کند.
 *
 * استفاده در route:
 *   fastify.get("/me", { preHandler: authenticate }, handler)
 */
export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw createError(
      ErrorCodes.AUTH_UNAUTHORIZED.code,
      ErrorCodes.AUTH_UNAUTHORIZED.message,
      401,
    );
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    // augment request with user
    (request as unknown as { user: typeof payload }).user = payload;
  } catch (err) {
    const error = err as Error;
    if (error.name === "TokenExpiredError") {
      throw createError(
        ErrorCodes.AUTH_TOKEN_EXPIRED.code,
        ErrorCodes.AUTH_TOKEN_EXPIRED.message,
        401,
      );
    }
    throw createError(
      ErrorCodes.AUTH_TOKEN_INVALID.code,
      ErrorCodes.AUTH_TOKEN_INVALID.message,
      401,
    );
  }
}

/**
 * شبیه authenticate ولی خطا نمی‌دهد اگه توکن نباشد (برای endpoints اختیاری).
 */
export async function optionalAuthenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return;
  }
  try {
    const payload = verifyAccessToken(header.slice(7));
    (request as unknown as { user: typeof payload }).user = payload;
  } catch {
    // در حالت اختیاری، خطا را نادیده می‌گیریم.
  }
}

/**
 * نوع user روی request — باید globaldeclare بشه.
 */
declare module "fastify" {
  interface FastifyRequest {
    user?: {
      sub: string;
      role: string;
      type: "access" | "refresh";
    };
  }
}

/**
 * بررسی نقش کاربر.
 * حتماً بعد از authenticate استفاده شود.
 */
export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw createError(
        ErrorCodes.AUTH_UNAUTHORIZED.code,
        ErrorCodes.AUTH_UNAUTHORIZED.message,
        401,
      );
    }
    if (!roles.includes(request.user.role)) {
      throw createError(
        ErrorCodes.AUTH_FORBIDDEN.code,
        ErrorCodes.AUTH_FORBIDDEN.message,
        403,
      );
    }
  };
}
