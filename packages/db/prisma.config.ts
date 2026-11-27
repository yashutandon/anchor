import { defineConfig } from "prisma/config";

// Prisma v7 configures datasource URLs in prisma.config.ts rather than schema.prisma.
// A non-empty fallback lets `prisma generate` validate the schema without a live DB env.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env["DATABASE_URL"] ??
      "postgresql://postgres:postgres@localhost:5432/anchor?schema=public",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
