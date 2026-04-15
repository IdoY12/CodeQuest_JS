/**
 * Recursively masks values whose keys match sensitive substrings.
 *
 * Responsibility: prevent passwords, tokens, and quiz answers from reaching logs.
 * Layer: @project/server-kit/logger
 * Depends on: sensitiveKeyMatchers.ts
 * Consumers: formatMeta.ts, sanitizeBody.ts
 */

import { SENSITIVE_KEY_SUBSTRINGS } from "./sensitiveKeyMatchers.js";

export function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactValue);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => {
        const lower = key.toLowerCase();
        const isSensitive = SENSITIVE_KEY_SUBSTRINGS.some((s) => lower.includes(s));
        return [key, isSensitive ? "***MASKED***" : redactValue(item)];
      }),
    );
  }

  return value;
}
