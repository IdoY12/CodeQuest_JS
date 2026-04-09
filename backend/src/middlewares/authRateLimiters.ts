/**
 * Express rate limiters tuned for credential, refresh, and logout traffic.
 *
 * Responsibility: throttle brute-force on tight routes; allow higher refresh volume.
 * Layer: backend middlewares
 * Depends on: express-rate-limit
 * Consumers: routers/auth.ts
 */

// Import the express-rate-limit middleware to prevent brute-force attacks and spam
import rateLimit from "express-rate-limit";

// Define the time window for the limit: 15 minutes (in milliseconds)
const AUTH_WINDOW_MS = 15 * 60 * 1000;

// A reusable function to create a limiter with a specific maximum number of requests
const limiter = (max: number) =>
  rateLimit({
    // Set the timeframe for counting requests
    windowMs: AUTH_WINDOW_MS,
    // Set the maximum allowed requests per window for a specific IP address
    max,
    // Return standard rate limiting headers (RateLimit-Limit, RateLimit-Remaining)
    standardHeaders: true,
    // Disable legacy headers (X-RateLimit-Limit, X-RateLimit-Remaining)
    legacyHeaders: false,
  });

// Limit registration attempts: stricter in production (8) and relaxed for local development (100)
export const authRegisterRateLimiter = process.env.NODE_ENV === "production" ? limiter(8) : limiter(100); 
// Limit login attempts to 8 per 15 minutes to mitigate brute-force password guessing
export const authLoginRateLimiter = limiter(8);
// Allow more requests for token refreshes (60) as this happens automatically in the background
export const authRefreshRateLimiter = limiter(60);
// Limit logout requests to 40 per window to prevent abuse of the logout endpoint
export const authLogoutRateLimiter = limiter(40);