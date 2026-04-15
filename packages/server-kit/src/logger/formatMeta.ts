/**
 * Serializes optional log metadata with redaction applied.
 *
 * Responsibility: stringify meta objects safely for stdout log lines.
 * Layer: @project/server-kit/logger
 * Depends on: redactValue.ts
 * Consumers: writeLine.ts
 */

import { redactValue } from "./redactValue.js";

export type LogMeta = Record<string, unknown> | undefined;

export function formatMeta(meta?: LogMeta): string {
  if (!meta) return "";

  try {
    return ` ${JSON.stringify(redactValue(meta))}`;
  } catch {
    return " [unserializable-meta]";
  }
}
