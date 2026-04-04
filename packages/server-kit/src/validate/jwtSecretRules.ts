/**
 * Shared rules for rejecting weak JWT secrets during production validation.
 *
 * Responsibility: placeholder set, minimum length, normalization helper.
 * Layer: @project/server-kit/validate
 * Depends on: none
 * Consumers: validateBackendSecurity.ts, validateIoSecurity.ts
 */

export const PLACEHOLDER_JWT_SECRETS = new Set(
  ["change-me", "change-me-too", "secret", "jwtsecret", "mysecret"].map((s) => s.toLowerCase()),
);

export const MIN_JWT_SECRET_LENGTH = 32;

export function normalizeSecret(value: string): string {
  return value.trim().toLowerCase();
}
