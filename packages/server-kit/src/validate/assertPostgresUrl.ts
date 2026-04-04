/**
 * Validates that `database.url` points at PostgreSQL when security checks run.
 *
 * Responsibility: single place for DATABASE_URL scheme enforcement.
 * Layer: @project/server-kit/validate
 * Depends on: none
 * Consumers: validateBackendSecurity.ts, validateIoSecurity.ts
 */

export function assertPostgresUrl(dbUrl: string, configKey: string): void {
  if (!dbUrl?.trim()) {
    throw new Error(`Missing required configuration: ${configKey}`);
  }
  if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
    throw new Error(`${configKey} must be a PostgreSQL connection URL`);
  }
}
