import { Prisma } from "@prisma/client";

/**
 * True when Prisma cannot reach or authenticate to the database.
 * Covers P1001, Postgres.app trust rejection, wrong credentials, etc.
 */
export function isDatabaseUnavailableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1001: server unreachable, P1017: server closed connection
    return ["P1001", "P1017"].includes(error.code);
  }
  const msg = error instanceof Error ? error.message : String(error);
  return (
    /P1001|P1017/i.test(msg) ||
    /Can't reach database server/i.test(msg) ||
    /connection refused/i.test(msg) ||
    /ECONNREFUSED/i.test(msg) ||
    /rejected.*trust authentication/i.test(msg) ||
    /Postgres\.app rejected/i.test(msg)
  );
}

export const DATABASE_UNAVAILABLE_MESSAGE =
  "Database unavailable. Start PostgreSQL and set DATABASE_URL in backend/.env (Docker: see README; Postgres.app: use a user+password URL, not trust-only).";
