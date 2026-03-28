import config from "config";

const PLACEHOLDER_JWT_SECRETS = new Set(
  ["change-me", "secret", "jwtsecret", "mysecret"].map((s) => s.toLowerCase()),
);

const MIN_JWT_SECRET_LENGTH = 32;

function normalizeSecret(value: string): string {
  return value.trim().toLowerCase();
}

export function validateProductionSecuritySettings(): void {
  if (!config.get<boolean>("app.validateSecurity")) {
    return;
  }

  const access = config.get<string>("app.jwtAccessSecret");
  if (!access?.trim()) {
    throw new Error("Missing required configuration: app.jwtAccessSecret");
  }
  if (access.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(`app.jwtAccessSecret must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
  }
  if (PLACEHOLDER_JWT_SECRETS.has(normalizeSecret(access))) {
    throw new Error("app.jwtAccessSecret must not use a known placeholder");
  }

  const dbUrl = config.get<string>("database.url");
  if (!dbUrl?.trim()) {
    throw new Error("Missing required configuration: database.url");
  }
  if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
    throw new Error("database.url must be a PostgreSQL connection URL");
  }

  const ioOrigin = config.get<string>("io.cors.origin");
  if (!ioOrigin?.trim() || ioOrigin === "*") {
    throw new Error(
      "io.cors.origin must be a non-empty explicit origin or comma-separated list when app.validateSecurity is true (set IO_CORS_ORIGIN)",
    );
  }
}
