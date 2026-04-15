/**
 * Verifies a refresh JWT and returns the typed AuthTokenPayload.
 *
 * Responsibility: HS256-only verification to match signing policy.
 * Layer: @project/auth-jwt
 * Depends on: parseVerifiedPayload, jwtAlgorithm
 * Consumers: backend refresh and logout handlers
 */

import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "./authTokenPayload.js";
import { JWT_SIGNING_ALGORITHM } from "./jwtAlgorithm.js";
import { parseVerifiedPayload } from "./parseVerifiedPayload.js";

export function verifyRefreshToken(token: string, refreshSecret: string): AuthTokenPayload {
  const decoded = jwt.verify(token, refreshSecret, { algorithms: [JWT_SIGNING_ALGORITHM] });

  return parseVerifiedPayload(decoded);
}
