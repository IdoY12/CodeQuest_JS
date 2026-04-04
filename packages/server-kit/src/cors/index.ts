/**
 * Re-exports CORS helpers for Express and Socket.IO services.
 *
 * Responsibility: one module for origin parsing shared by HTTP and WS layers.
 * Layer: @project/server-kit/cors
 * Depends on: cors/*.ts
 * Consumers: backend (optional), io via "./cors"
 */

export { resolveExpressCorsOrigin } from "./resolveExpressCorsOrigin.js";
export { resolveSocketIoCors } from "./resolveSocketIoCors.js";
export { parseCommaSeparatedOrigin } from "./parseCommaSeparatedOrigin.js";
