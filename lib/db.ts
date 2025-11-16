import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Connection pool configuration for serverless environments
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });
};

// Singleton pattern for serverless - reuse connection across requests
export const db =
  globalForPrisma.prisma ?? createPrismaClient();

// In production (Vercel serverless), we need to reuse the connection
// In development, we can use the global instance
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
} else {
  // In production, store in global to reuse across serverless invocations
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = db;
  }
}

// Handle connection errors gracefully and ensure proper cleanup
if (typeof process !== "undefined") {
  // Graceful shutdown
  const gracefulShutdown = async () => {
    try {
      await db.$disconnect();
    } catch (error) {
      console.error("[DB] Error during disconnect:", error);
    }
  };

  process.on("beforeExit", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
  
  // Handle uncaught errors
  process.on("uncaughtException", async (error) => {
    console.error("[DB] Uncaught exception:", error);
    await gracefulShutdown();
    process.exit(1);
  });
}

