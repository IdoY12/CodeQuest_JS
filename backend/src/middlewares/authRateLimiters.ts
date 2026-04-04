/**
 * Express rate limiters tuned for credential, refresh, and logout traffic.
 *
 * Responsibility: throttle brute-force on tight routes; allow higher refresh volume.
 * Layer: backend middlewares
 * Depends on: express-rate-limit
 * Consumers: routers/auth.ts
 */

import rateLimit from "express-rate-limit";

const AUTH_WINDOW_MS = 15 * 60 * 1000;

const limiter = (max: number) =>
  rateLimit({
    windowMs: AUTH_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });

export const authRegisterRateLimiter = limiter(8);
export const authLoginRateLimiter = limiter(8);
export const authRefreshRateLimiter = limiter(60);
export const authLogoutRateLimiter = limiter(40);
