import type { FastifyReply, FastifyRequest } from "fastify";
import type { ZodSchema } from "zod";
import { createError, ErrorCodes } from "../utils/response.js";

/**
 * اعتبارسنجی بدنه‌ی درخواست با Zod.
 * در صورت موفقیت، داده‌ی validate‌شده در `request.body` قرار می‌گیرد.
 *
 *   { preHandler: validateBody(RegisterSchema) }
 */
export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      throw createError(
        ErrorCodes.VALIDATION_FAILED.code,
        ErrorCodes.VALIDATION_FAILED.message,
        422,
        result.error.issues,
      );
    }
    request.body = result.data;
  };
}

/**
 * اعتبارسنجی query string.
 */
export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.query);
    if (!result.success) {
      throw createError(
        ErrorCodes.VALIDATION_FAILED.code,
        ErrorCodes.VALIDATION_FAILED.message,
        422,
        result.error.issues,
      );
    }
    request.query = result.data as Record<string, unknown>;
  };
}

/**
 * اعتبارسنجی پارامترهای مسیر.
 */
export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      throw createError(
        ErrorCodes.VALIDATION_FAILED.code,
        ErrorCodes.VALIDATION_FAILED.message,
        422,
        result.error.issues,
      );
    }
    request.params = result.data as Record<string, unknown>;
  };
}
