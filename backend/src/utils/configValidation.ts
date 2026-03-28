import config from "config";

const PLACEHOLDER_JWT_SECRETS = new Set(
  ["change-me", "change-me-too", "secret", "jwtsecret", "mysecret"].map((s) => s.toLowerCase()),
);

const MIN_JWT_SECRET_LENGTH = 32;

function normalizeSecret(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Runs when `app.validateSecurity` is true (production merge).
 * Ensures secrets, database URL, and CORS policy are not unsafe defaults.
 */
export function validateProductionSecuritySettings(): void {
  if (!config.get<boolean>("app.validateSecurity")) {
    return;
  }

  const access = config.get<string>("app.jwtAccessSecret");
  const refresh = config.get<string>("app.jwtRefreshSecret");

  for (const [key, value] of [
    ["app.jwtAccessSecret", access],
    ["app.jwtRefreshSecret", refresh],
  ] as const) {
    if (!value?.trim()) {
      throw new Error(`Missing required configuration: ${key}`);
    }
    if (value.length < MIN_JWT_SECRET_LENGTH) {
      throw new Error(`${key} must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
    }
    if (PLACEHOLDER_JWT_SECRETS.has(normalizeSecret(value))) {
      throw new Error(`${key} must not use a known placeholder; set strong secrets via environment`);
    }
  }

  const dbUrl = config.get<string>("database.url");
  if (!dbUrl?.trim()) {
    throw new Error("Missing required configuration: database.url");
  }
  if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
    throw new Error("database.url must be a PostgreSQL connection URL");
  }

  const appOrigin = config.get<string>("app.cors.origin");
  if (!appOrigin?.trim() || appOrigin === "*") {
    throw new Error(
      "app.cors.origin must be a non-empty explicit origin or comma-separated list when app.validateSecurity is true (set CORS_ORIGIN)",
    );
  }

}
