import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { logError, logInfo } from "../../utils/logger.js";
import { signAccessToken, verifyRefreshToken } from "../../utils/sessionJwtTokens.js";

export async function authRefreshHandler(request: Request, response: Response): Promise<void> {
  const refreshTokenValue = String(request.body?.refreshToken ?? "");
  if (!refreshTokenValue) {
    response.status(400).json({ error: "Missing refresh token" });
    return;
  }
  try {
    const payload = verifyRefreshToken(refreshTokenValue);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, tokenVersion: true },
    });
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      response.status(401).json({ error: "Invalid refresh token" });
      return;
    }
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    });
    logInfo("[AUTH]", "refresh:success", { userId: payload.userId });
    response.json({ accessToken });
  } catch (error) {
    logError("[AUTH]", error, { phase: "refresh" });
    response.status(401).json({ error: "Invalid refresh token" });
  }
}
