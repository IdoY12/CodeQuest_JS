import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth.js";
import { logError, logInfo, logWarn } from "../lib/logger.js";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    logWarn("[AUTH]", "missing-bearer-token", { path: req.originalUrl });
    return res.status(401).json({ error: "Missing bearer token" });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    logInfo("[AUTH]", "access-token-validated", { userId: decoded.userId, path: req.originalUrl });
    req.user = { userId: decoded.userId, email: decoded.email };
    return next();
  } catch (error) {
    logError("[AUTH]", error, { path: req.originalUrl, reason: "invalid-access-token" });
    return res.status(401).json({ error: "Invalid token" });
  }
}
