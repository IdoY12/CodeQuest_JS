import config from "config";

export function readJwtAccessSecretFromConfig(): string {
  const value = config.get<string>("app.jwtAccessSecret");
  if (!value?.trim()) {
    throw new Error("JWT_ACCESS_SECRET must be configured");
  }
  return value.trim();
}

export function readJwtRefreshSecretFromConfig(): string {
  const value = config.get<string>("app.jwtRefreshSecret");
  if (!value?.trim()) {
    throw new Error("JWT_REFRESH_SECRET must be configured");
  }
  return value.trim();
}
