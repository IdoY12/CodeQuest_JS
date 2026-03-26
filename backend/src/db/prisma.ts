import { PrismaClient } from "@prisma/client";
import config from "config";
import { injectDatabaseUrlFromConfig } from "./databaseUrl.js";

injectDatabaseUrlFromConfig();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (config.get<string>("env") !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

