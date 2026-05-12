import type { SessionState } from "./types.js";

type DuelPlayerSlot = "player1" | "player2";

/** Returns which slot a socket occupies; falls back to userId and updates socketId on reconnect. */
export function resolveDuelPlayerSlot(session: SessionState, socketId: string, userId?: string): DuelPlayerSlot | null {
  if (socketId === session.player1.socketId) return "player1";
  if (socketId === session.player2.socketId) return "player2";
  if (userId === session.player1.userId) { session.player1.socketId = socketId; return "player1"; }
  if (userId === session.player2.userId) { session.player2.socketId = socketId; return "player2"; }
  return null;
}
