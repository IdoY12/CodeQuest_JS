/**
 * Barrel re-exports duel session lifecycle entry points for handlers.
 *
 * Responsibility: preserve `../session.js` import path after file split.
 * Layer: io duel session
 * Depends on: startRound.ts, endSession.ts
 * Consumers: playerReady.ts, submitAnswer.ts
 */

export { endSession } from "./endSession.js";
export { startRound } from "./startRound.js";
