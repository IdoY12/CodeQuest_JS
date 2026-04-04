/**
 * Creates a short-lived access JWT carrying user id, email, and tokenVersion.
 *
 * Responsibility: symmetric HS256 signing with explicit algorithm.
 * Layer: @project/auth-jwt
 * Depends on: authTokenPayload, accessTokenJwtExpiry, jwtAlgorithm
 * Consumers: backend sessionJwtTokens wrapper
 */

import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "./authTokenPayload.js";
import { ACCESS_TOKEN_JWT_EXPIRY } from "./accessTokenJwtExpiry.js";
import { JWT_SIGNING_ALGORITHM } from "./jwtAlgorithm.js";

export function signAccessToken(payload: AuthTokenPayload, accessSecret: string): string {
  return jwt.sign(payload, accessSecret, { expiresIn: ACCESS_TOKEN_JWT_EXPIRY, algorithm: JWT_SIGNING_ALGORITHM });
}
