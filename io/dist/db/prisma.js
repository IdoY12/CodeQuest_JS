import { PrismaClient } from "@prisma/client";
import config from "config";
import { injectDatabaseUrlFromConfig } from "./databaseUrl.js";
injectDatabaseUrlFromConfig();
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (config.get("env") !== "production") {
    globalForPrisma.prisma = prisma;
}
export async function connectDatabase() {
    await prisma.$connect();
}
