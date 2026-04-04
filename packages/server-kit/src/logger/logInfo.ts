/**
 * Emits an INFO-level log entry for Node services (backend, io).
 *
 * Responsibility: structured info logging with automatic secret redaction.
 * Layer: @project/server-kit/logger
 * Depends on: writeLine.ts, formatMeta.ts
 * Consumers: backend and io handlers
 */

import type { LogMeta } from "./formatMeta.js";
import { writeLine } from "./writeLine.js";

export function logInfo(prefix: string, message: string, meta?: LogMeta) {
  writeLine("INFO", prefix, message, meta);
}
