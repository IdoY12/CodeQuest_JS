/**
 * Emits a WARN-level log entry for Node services (backend, io).
 *
 * Responsibility: non-fatal anomalies (auth failures, validation issues).
 * Layer: @project/server-kit/logger
 * Depends on: writeLine.ts, formatMeta.ts
 * Consumers: backend and io handlers
 */

import type { LogMeta } from "./formatMeta.js";
import { writeLine } from "./writeLine.js";

export function logWarn(prefix: string, message: string, meta?: LogMeta) {
  writeLine("WARN", prefix, message, meta);
}
