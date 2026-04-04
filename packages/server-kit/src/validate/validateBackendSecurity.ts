/**
 * Production security gate for the REST backend (JWT, DB, Express CORS).
 *
 * Responsibility: fail fast on weak secrets or unsafe CORS before listening.
 * Layer: @project/server-kit/validate
 * Depends on: jwtSecretRules.ts, assertPostgresUrl.ts, assertNonWildcardOrigin.ts, config
 * Consumers: backend/src/index.ts
 */

import config from "config";
import { assertNonWildcardOrigin } from "./assertNonWildcardOrigin.js";
import { assertPostgresUrl } from "./assertPostgresUrl.js";
import { MIN_JWT_SECRET_LENGTH, PLACEHOLDER_JWT_SECRETS, normalizeSecret } from "./jwtSecretRules.js";

export function validateBackendProductionSecuritySettings(): void {
  if (!config.get<boolean>("app.validateSecurity")) return;

  for (const [key, value] of [
    ["app.jwtAccessSecret", config.get<string>("app.jwtAccessSecret")],
    ["app.jwtRefreshSecret", config.get<string>("app.jwtRefreshSecret")],
  ] as const) {
    if (!value?.trim()) throw new Error(`Missing required configuration: ${key}`);
    if (value.length < MIN_JWT_SECRET_LENGTH) {
      throw new Error(`${key} must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
    }
    if (PLACEHOLDER_JWT_SECRETS.has(normalizeSecret(value))) {
      throw new Error(`${key} must not use a known placeholder; set strong secrets via environment`);
    }
  }

  assertPostgresUrl(config.get<string>("database.url"), "database.url");
  assertNonWildcardOrigin(config.get<string>("app.cors.origin"), "set CORS_ORIGIN");
}
