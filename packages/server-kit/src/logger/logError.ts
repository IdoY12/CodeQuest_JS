/**
 * Emits an ERROR-level log entry, normalizing Error objects into metadata.
 *
 * Responsibility: capture stack traces without leaking sensitive fields.
 * Layer: @project/server-kit/logger
 * Depends on: writeLine.ts, formatMeta.ts
 * Consumers: backend and io error paths
 */

import type { LogMeta } from "./formatMeta.js";
import { writeLine } from "./writeLine.js";

export function logError(prefix: string, error: unknown, meta?: LogMeta) {
  const payload = {
    ...(meta ?? {}),
    error:
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) },
  };
  writeLine("ERROR", prefix, "failure", payload);
}
