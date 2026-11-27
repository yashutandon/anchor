import type { PrismaClient } from "./generated/prisma/client";

// Only packages/db may import Prisma.
// Prisma v7 requires a driver adapter (such as @prisma/adapter-pg) when instantiated;
// this stub preserves the boundary until database connectivity is added.
export type DbClient = PrismaClient;

/**
 * Returns the configured PrismaClient singleton.
 */
export function getPrismaClient(): DbClient {
  // TODO(db): Instantiate PrismaClient with a PostgreSQL driver adapter and DATABASE_URL.
  throw new Error("not implemented");
}
