/**
 * Production security gate for the Socket.IO duel service (access JWT secret, DB, CORS).
 *
 * Responsibility: align io deployment rules with backend secret strength checks.
 * Layer: @project/server-kit/validate
 * Depends on: jwtSecretRules.ts, assertPostgresUrl.ts, assertNonWildcardOrigin.ts, config
 * Consumers: io/src/index.ts
 */

import config from "config";
import { assertNonWildcardOrigin } from "./assertNonWildcardOrigin.js";
import { assertPostgresUrl } from "./assertPostgresUrl.js";
import { MIN_JWT_SECRET_LENGTH, PLACEHOLDER_JWT_SECRETS, normalizeSecret } from "./jwtSecretRules.js";

export function validateIoProductionSecuritySettings(): void {
  if (!config.get<boolean>("app.validateSecurity")) return;

  const access = config.get<string>("app.jwtAccessSecret");

  if (!access?.trim()) throw new Error("Missing required configuration: app.jwtAccessSecret");

  if (access.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(`app.jwtAccessSecret must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
  }

  if (PLACEHOLDER_JWT_SECRETS.has(normalizeSecret(access))) {
    throw new Error("app.jwtAccessSecret must not use a known placeholder");
  }

  assertPostgresUrl(config.get<string>("database.url"), "database.url");
  assertNonWildcardOrigin(config.get<string>("io.cors.origin"), "set IO_CORS_ORIGIN");
}
