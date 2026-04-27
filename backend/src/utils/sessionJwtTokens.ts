import type { AuthTokenPayload } from "@project/auth-jwt/authTokenPayload";
import { signAccessToken as signAccessJwt } from "@project/auth-jwt/signAccessToken";
import { signRefreshToken as signRefreshJwt } from "@project/auth-jwt/signRefreshToken";
import { verifyAccessToken as verifyAccessJwt } from "@project/auth-jwt/verifyAccessToken";
import { verifyRefreshToken as verifyRefreshJwt } from "@project/auth-jwt/verifyRefreshToken";
import config from "config";

function readJwtAccessSecretFromConfig(): string {
  const value = config.get<string>("app.jwtAccessSecret");

  if (!value?.trim()) {
    throw new Error("JWT_ACCESS_SECRET must be configured");
  }

  return value.trim();
}

function readJwtRefreshSecretFromConfig(): string {
  const value = config.get<string>("app.jwtRefreshSecret");

  if (!value?.trim()) {
    throw new Error("JWT_REFRESH_SECRET must be configured");
  }

  return value.trim();
}

export function signAccessToken(payload: AuthTokenPayload): string {
  return signAccessJwt(payload, readJwtAccessSecretFromConfig());
}

export function signRefreshToken(payload: AuthTokenPayload): string {
  return signRefreshJwt(payload, readJwtRefreshSecretFromConfig());
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return verifyAccessJwt(token, readJwtAccessSecretFromConfig());
}

/**
 * Verifies a refresh JWT string (signature, expiry, HS256). Runtime implementation lives in
 * `@project/auth-jwt/verifyRefreshToken` → compiled `jwt.verify` + payload parse — not in `.d.ts` files.
 * This wrapper supplies `app.jwtRefreshSecret` from config so handlers only pass the token.
 */
export function verifyRefreshToken(token: string): AuthTokenPayload {
  return verifyRefreshJwt(token, readJwtRefreshSecretFromConfig());
}
