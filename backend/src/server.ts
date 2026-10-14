import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";

import { env } from "./config/env.js";
import { errorHandler } from "./utils/response.js";
import { registerAuthRoutes } from "./modules/auth/auth.routes.js";
import { registerUsersRoutes } from "./modules/users/users.routes.js";
import { registerDictionaryRoutes } from "./modules/dictionary/dictionary.routes.js";
import { registerVocabularyRoutes } from "./modules/vocabulary/vocabulary.routes.js";

/**
 * ساخت و راه‌اندازی سرور Fastify.
 */
async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      ...(env.NODE_ENV === "development"
        ? {
            transport: {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            },
          }
        : {}),
    },
    trustProxy: true,
  });

  // ─── 1. Helmet (Security headers) ────────
  await fastify.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === "production" ? {} : false,
  });

  // ─── 2. CORS ─────────────────────────────
  const origins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
  await fastify.register(cors, {
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  // ─── 3. Cookies ──────────────────────────
  await fastify.register(cookie, {
    secret: env.JWT_REFRESH_SECRET,
  });

  // ─── 4. Rate Limiting ────────────────────
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
  });

  // ─── 5. Error Handler ────────────────────
  fastify.setErrorHandler(errorHandler);

  // ─── 6. Routes ───────────────────────────
  await registerAuthRoutes(fastify);
  await registerUsersRoutes(fastify);
  await registerDictionaryRoutes(fastify);
  await registerVocabularyRoutes(fastify);

  // ─── 7. Health Check ────────────────────
  fastify.get("/api/health", async (_request, reply) => {
    return reply.code(200).send({
      data: {
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
    });
  });

  // ─── 8. 404 Handler ──────────────────────
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: {
        code: "NOT_FOUND",
        message: `مسیر ${request.method} ${request.url} یافت نشد.`,
      },
    });
  });

  return fastify;
}

/**
 * شروع سرور.
 */
async function start(): Promise<void> {
  const server = await buildServer();

  try {
    await server.listen({
      port: env.PORT,
      host: env.HOST,
    });
    server.log.info(`🚀 LINGO Backend running on http://${env.HOST}:${env.PORT}`);
    server.log.info(`   Environment: ${env.NODE_ENV}`);
    server.log.info(`   CORS origins: ${env.CORS_ORIGIN}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, async () => {
      server.log.info(`\n${signal} received, shutting down gracefully...`);
      await server.close();
      process.exit(0);
    });
  }
}

start();
