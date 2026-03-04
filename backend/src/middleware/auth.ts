import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth.js";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId, email: decoded.email };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
