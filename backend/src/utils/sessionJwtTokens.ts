import type { AuthTokenPayload } from "@project/auth-jwt/authTokenPayload";
import { signAccessToken as signAccessJwt } from "@project/auth-jwt/signAccessToken";
import { signRefreshToken as signRefreshJwt } from "@project/auth-jwt/signRefreshToken";
import { verifyAccessToken as verifyAccessJwt } from "@project/auth-jwt/verifyAccessToken";
import { verifyRefreshToken as verifyRefreshJwt } from "@project/auth-jwt/verifyRefreshToken";
import { readJwtAccessSecretFromConfig, readJwtRefreshSecretFromConfig } from "./jwtSecretsFromConfig.js";

export type { AuthTokenPayload } from "@project/auth-jwt/authTokenPayload";

export function signAccessToken(payload: AuthTokenPayload): string {
  return signAccessJwt(payload, readJwtAccessSecretFromConfig());
}

export function signRefreshToken(payload: AuthTokenPayload): string {
  return signRefreshJwt(payload, readJwtRefreshSecretFromConfig());
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return verifyAccessJwt(token, readJwtAccessSecretFromConfig());
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  return verifyRefreshJwt(token, readJwtRefreshSecretFromConfig());
}
