/**
 * Redacts an HTTP body (or arbitrary JSON-shaped value) for safe logging.
 *
 * Responsibility: reuse the same redaction rules as structured meta logs.
 * Layer: @project/server-kit/logger
 * Depends on: redactValue.ts
 * Consumers: backend request logger middleware
 */

import { redactValue } from "./redactValue.js";

export function sanitizeBody(body: unknown) {
  return redactValue(body);
}
