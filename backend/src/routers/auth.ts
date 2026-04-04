/**
 * Express router for registration, login, token refresh, profile bootstrap, and logout.
 *
 * Responsibility: mount auth handlers with per-route rate limits and JWT gate for /me.
 * Layer: backend HTTP
 * Depends on: auth controllers, authMiddleware, authRateLimiters
 * Consumers: app.ts
 */

import { Router } from "express";
import { authLoginHandler } from "../controllers/auth/authLoginHandler.js";
import { authLogoutHandler } from "../controllers/auth/authLogoutHandler.js";
import { authMeHandler } from "../controllers/auth/authMeHandler.js";
import { authRefreshHandler } from "../controllers/auth/authRefreshHandler.js";
import { authRegisterHandler } from "../controllers/auth/authRegisterHandler.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  authLoginRateLimiter,
  authLogoutRateLimiter,
  authRefreshRateLimiter,
  authRegisterRateLimiter,
} from "../middlewares/authRateLimiters.js";

export const authRouter = Router();

authRouter.post("/register", authRegisterRateLimiter, authRegisterHandler);
authRouter.post("/login", authLoginRateLimiter, authLoginHandler);
authRouter.post("/refresh", authRefreshRateLimiter, authRefreshHandler);
authRouter.get("/me", authMiddleware, authMeHandler);
authRouter.post("/logout", authLogoutRateLimiter, authLogoutHandler);
