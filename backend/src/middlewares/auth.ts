import { NextFunction, Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../@types/auth.js";
import {
  readCachedTokenVersionForUser,
  writeCachedTokenVersionForUser,
} from "../utils/authenticatedUserTokenVersionCache.js";
import { logError, logInfo, logWarn } from "../utils/logger.js";
import { verifyAccessToken } from "../utils/sessionJwtTokens.js";

export type { AuthenticatedRequest } from "../@types/auth.js";

export async function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    logWarn("[AUTH]", "missing-bearer-token", { path: request.originalUrl });
    response.status(401).json({ error: "Missing bearer token" });
    return;
  }
  const token = authHeader.slice(7);

  try {
    const decoded = verifyAccessToken(token);
    const cachedVersion = readCachedTokenVersionForUser(decoded.userId);

    if (cachedVersion !== undefined && cachedVersion === decoded.tokenVersion) {
      request.user = {
        userId: decoded.userId,
        email: decoded.email,
        tokenVersion: decoded.tokenVersion,
      };
      logInfo("[AUTH]", "access-token-validated-cache", { userId: decoded.userId, path: request.originalUrl });
      next();
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, tokenVersion: true },
    });

    if (!user) {
      logWarn("[AUTH]", "user-not-found-for-token", { userId: decoded.userId, path: request.originalUrl });
      response.status(401).json({ error: "Invalid token" });
      return;
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      logWarn("[AUTH]", "token-version-mismatch", { userId: decoded.userId, path: request.originalUrl });
      response.status(401).json({ error: "Invalid token" });
      return;
    }
    writeCachedTokenVersionForUser(user.id, user.tokenVersion);
    logInfo("[AUTH]", "access-token-validated", { userId: decoded.userId, path: request.originalUrl });
    request.user = { userId: decoded.userId, email: decoded.email, tokenVersion: decoded.tokenVersion };
    next();
  } catch (error) {
    logError("[AUTH]", error, { path: request.originalUrl, reason: "invalid-access-token" });
    response.status(401).json({ error: "Invalid token" });
  }
}

/** Attaches `request.user` when a valid Bearer token is present; otherwise continues without auth (no 401). */
export async function optionalAuthMiddleware(
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  delete request.user;
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    const cachedVersion = readCachedTokenVersionForUser(decoded.userId);
    if (cachedVersion !== undefined && cachedVersion === decoded.tokenVersion) {
      request.user = { userId: decoded.userId, email: decoded.email, tokenVersion: decoded.tokenVersion };
      next();
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, tokenVersion: true },
    });
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      next();
      return;
    }
    writeCachedTokenVersionForUser(user.id, user.tokenVersion);
    request.user = { userId: decoded.userId, email: decoded.email, tokenVersion: decoded.tokenVersion };
  } catch {
    // Invalid token on an optional-auth route: treat as anonymous.
  }
  next();
}
