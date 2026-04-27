/**
 * Maps a socket id to player1 or player2 within an active duel session.
 *
 * Responsibility: prevent non-participant sockets from acting as a player.
 * Layer: io duel namespace
 * Depends on: types.ts SessionState
 * Consumers: playerReady.ts, submitAnswer.ts
 */

import type { SessionState } from "./types.js";

type DuelPlayerSlot = "player1" | "player2";

export function resolveDuelPlayerSlot(session: SessionState, socketId: string): DuelPlayerSlot | null {
  if (socketId === session.player1.socketId) return "player1";

  if (socketId === session.player2.socketId) return "player2";

  return null;
}
