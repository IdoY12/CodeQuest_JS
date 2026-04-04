/**
 * Verifies an access JWT and returns the typed AuthTokenPayload.
 *
 * Responsibility: HS256-only verification to match signing policy.
 * Layer: @project/auth-jwt
 * Depends on: parseVerifiedPayload, jwtAlgorithm
 * Consumers: backend auth middleware, io socket auth
 */

import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "./authTokenPayload.js";
import { JWT_SIGNING_ALGORITHM } from "./jwtAlgorithm.js";
import { parseVerifiedPayload } from "./parseVerifiedPayload.js";

export function verifyAccessToken(token: string, accessSecret: string): AuthTokenPayload {
  const decoded = jwt.verify(token, accessSecret, { algorithms: [JWT_SIGNING_ALGORITHM] });
  return parseVerifiedPayload(decoded);
}
