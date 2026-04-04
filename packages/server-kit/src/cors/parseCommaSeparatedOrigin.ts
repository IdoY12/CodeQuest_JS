/**
 * Normalizes a config string into either one origin or an allow-list array.
 *
 * Responsibility: comma-separated CORS origins used by Express and Socket.IO.
 * Layer: @project/server-kit/cors
 * Depends on: none
 * Consumers: resolveExpressCorsOrigin.ts, resolveSocketIoCors.ts
 */

export function parseCommaSeparatedOrigin(raw: string): string | string[] {
  if (!raw.includes(",")) return raw;
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
