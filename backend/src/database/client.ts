import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma Client — از ایجاد چند اتصال در dev (Hot Reload) جلوگیری می‌کند.
 * در production با لاگ سطح متوسط.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { PrismaClient } from "@prisma/client";
