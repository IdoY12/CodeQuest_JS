import { createHash } from "crypto";
import { prisma } from "@project/db";

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function cleanupExpiredRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } });
}

export async function storeRefreshToken(userId: string, token: string, family: string): Promise<void> {
  await cleanupExpiredRefreshTokens(userId);
  await prisma.refreshToken.create({
    data: {
      userId,
      family,
      tokenHash: hashRefreshToken(token),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
}
