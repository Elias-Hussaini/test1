import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * فرمت استاندارد پاسخ موفق.
 * { data: T }
 */
export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200,
): FastifyReply {
  return reply.code(statusCode).send({ data });
}

/**
 * فرمت استاندارد پاسخ خطا.
 * { error: { code, message, details? } }
 */
export function sendError(
  reply: FastifyReply,
  error: ApiError,
): FastifyReply {
  return reply.code(error.statusCode).send({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    },
  });
}

export type ApiError = {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
};

/**
 * ساخت خطای استاندارد با کد و وضعیت HTTP.
 */
export function createError(
  code: string,
  message: string,
  statusCode = 400,
  details?: unknown,
): ApiError {
  return { code, message, statusCode, details };
}

/**
 * کدهای خطای استاندارد در کل پروژه.
 * این کدها در Frontend هم استفاده می‌شوند تا خطاها را هندل کنند.
 */
export const ErrorCodes = {
  // Auth
  AUTH_INVALID_CREDENTIALS: { code: "AUTH_INVALID_CREDENTIALS", message: "ایمیل یا رمز عبور اشتباه است.", statusCode: 401 },
  AUTH_EMAIL_TAKEN: { code: "AUTH_EMAIL_TAKEN", message: "این ایمیل قبلاً ثبت شده است.", statusCode: 409 },
  AUTH_USERNAME_TAKEN: { code: "AUTH_USERNAME_TAKEN", message: "این نام کاربری قبلاً گرفته شده است.", statusCode: 409 },
  AUTH_UNAUTHORIZED: { code: "AUTH_UNAUTHORIZED", message: "برای دسترسی به این بخش باید وارد شوید.", statusCode: 401 },
  AUTH_FORBIDDEN: { code: "AUTH_FORBIDDEN", message: "شما اجازه‌ی این کار را ندارید.", statusCode: 403 },
  AUTH_TOKEN_INVALID: { code: "AUTH_TOKEN_INVALID", message: "توکن نامعتبر است.", statusCode: 401 },
  AUTH_TOKEN_EXPIRED: { code: "AUTH_TOKEN_EXPIRED", message: "نشست شما منقضی شده است.", statusCode: 401 },
  AUTH_USER_BLOCKED: { code: "AUTH_USER_BLOCKED", message: "حساب شما مسدود شده است.", statusCode: 403 },
  AUTH_REFRESH_INVALID: { code: "AUTH_REFRESH_INVALID", message: "Refresh token نامعتبر است.", statusCode: 401 },

  // Validation
  VALIDATION_FAILED: { code: "VALIDATION_FAILED", message: "ورودی نامعتبر است.", statusCode: 422 },

  // Resources
  RESOURCE_NOT_FOUND: { code: "RESOURCE_NOT_FOUND", message: "منبع مورد نظر یافت نشد.", statusCode: 404 },
  RESOURCE_CONFLICT: { code: "RESOURCE_CONFLICT", message: "این منبع قبلاً وجود دارد.", statusCode: 409 },

  // Rate limit
  RATE_LIMIT_EXCEEDED: { code: "RATE_LIMIT_EXCEEDED", message: "تعداد درخواست‌ها زیاد بود. کمی صبر کنید.", statusCode: 429 },

  // Server
  INTERNAL_ERROR: { code: "INTERNAL_ERROR", message: "خطای داخلی سرور.", statusCode: 500 },
} as const;

/**
 * هندلر خطاهای سراسری.
 */
export function errorHandler(
  error: Error & { statusCode?: number; code?: string },
  _request: FastifyRequest,
  reply: FastifyReply,
): void {
  // خطاهای Zod (validation)
  if (error.name === "ZodError") {
    sendError(reply, {
      ...ErrorCodes.VALIDATION_FAILED,
      details: (error as unknown as { issues: unknown[] }).issues,
    });
    return;
  }

  // خطاهای ساخته‌شده با createError
  if (error.code && error.statusCode) {
    sendError(reply, {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  // خطاهای Fastify встроی (مثل 404 route)
  if ("statusCode" in error && typeof error.statusCode === "number") {
    reply.code(error.statusCode).send({
      error: {
        code: `HTTP_${error.statusCode}`,
        message: error.message,
      },
    });
    return;
  }

  // خطای ناشناخته
  console.error("[UNHANDLED_ERROR]", error);
  sendError(reply, ErrorCodes.INTERNAL_ERROR);
}
