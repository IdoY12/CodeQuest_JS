/**
 * POST /api/auth/logout — revokes refresh+access families via tokenVersion bump.
 *
 * Responsibility: accept Bearer access or body.refreshToken, then invalidate all JWTs.
 * Layer: backend auth controller
 * Depends on: Prisma, session JWT utils, revokeAllSessionsForUser
 * Consumers: auth router
 */

import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { logError, logInfo, logWarn } from "../../utils/logger.js";
import { revokeAllSessionsForUser } from "../../utils/revokeAllSessionsForUser.js";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/sessionJwtTokens.js";

export async function authLogoutHandler(request: Request, response: Response): Promise<void> {
  const bearer = request.headers.authorization?.startsWith("Bearer ") ? request.headers.authorization.slice(7) : "";
  const refreshTokenValue = String((request.body as { refreshToken?: unknown } | undefined)?.refreshToken ?? "");

  try {
    let userId: string | null = null;

    if (bearer) {
      const payload = verifyAccessToken(bearer);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { tokenVersion: true },
      });
      if (user && user.tokenVersion === payload.tokenVersion) {
        userId = payload.userId;
      }
    }

    if (!userId && refreshTokenValue) {
      const payload = verifyRefreshToken(refreshTokenValue);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { tokenVersion: true },
      });
      if (user && user.tokenVersion === payload.tokenVersion) {
        userId = payload.userId;
      }
    }

    if (!userId) {
      logWarn("[AUTH]", "logout:invalid-credentials");
      response.status(401).json({ error: "Invalid credentials" });
      return;
    }

    await revokeAllSessionsForUser(userId);
    logInfo("[AUTH]", "logout:success", { userId });
    response.json({ ok: true });
  } catch (error) {
    logError("[AUTH]", error, { phase: "logout" });
    response.status(401).json({ error: "Invalid credentials" });
  }
}
