import { PrismaClient } from "@prisma/client";
import config from "config";
import { injectDatabaseUrlFromConfig } from "./databaseUrl.js";
// Ensure Prisma sees DATABASE_URL before the client is instantiated.
injectDatabaseUrlFromConfig();
// Keep a single PrismaClient instance in dev/hot-reload environments.
const globalForPrisma = globalThis;
// Reuse existing client if present; otherwise create a new one.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
// Cache the instance globally in non-production to avoid extra DB connections.
if (config.get("env") !== "production") {
    globalForPrisma.prisma = prisma;
}
export async function connectDatabase() {
    // Open the DB connection at server startup.
    await prisma.$connect();
}
