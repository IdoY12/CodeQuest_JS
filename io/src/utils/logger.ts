/**
 * Re-exports shared structured logging for the Socket.IO duel service.
 *
 * Responsibility: keep io and backend on identical redaction rules.
 * Layer: io service
 * Depends on: @project/server-kit/logger
 * Consumers: io socket handlers and bootstrap
 */

export { logError, logInfo, logWarn } from "@project/server-kit/logger";
