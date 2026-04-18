/**
 * Registers `rematch_request` so matched players can start a new duel after finishing.
 *
 * Responsibility: coordinate rematch acknowledgement and spawn a fresh session.
 * Layer: io duel handlers
 * Depends on: rematchEntries state, finalizeMatch
 * Consumers: duel/index.ts
 */

import type { Socket } from "socket.io";
import { logInfo } from "../../../utils/logger.js";
import { finalizeMatch } from "../queue.js";
import { rematchEntries } from "../state.js";
import type { DuelNamespace, QueueEntry } from "../types.js";

export function registerRematchAbandoned(socket: Socket, duel: DuelNamespace) {
  socket.on("rematch_abandoned", (payload: { session_id: string }) => {
    const entry = rematchEntries.get(payload.session_id);
    if (!entry) return;
    const userId = socket.data.authenticatedUserId as string | undefined;
    if (!userId) return;
    if (entry.player1.userId !== userId && entry.player2.userId !== userId) return;
    if (entry.timer) clearTimeout(entry.timer);
    rematchEntries.delete(payload.session_id);
    const waitingSocketId = entry.player1.userId === userId
      ? entry.requests.get(entry.player2.userId)
      : entry.requests.get(entry.player1.userId);
    if (waitingSocketId) duel.to(waitingSocketId).emit("rematch_declined", { reason: "opponent_left" });
    logInfo("[DUEL]", "rematch:abandoned", { userId, sessionId: payload.session_id });
  });
}

export function registerRematchRequest(socket: Socket, duel: DuelNamespace) {
  socket.on("rematch_request", (payload: { session_id: string }) => {
    const entry = rematchEntries.get(payload.session_id);
    if (!entry) {
      socket.emit("rematch_declined", { reason: "expired" });
      return;
    }

    const userId = socket.data.authenticatedUserId as string | undefined;
    if (!userId) return;

    const isPlayer1 = entry.player1.userId === userId;
    const isPlayer2 = entry.player2.userId === userId;
    if (!isPlayer1 && !isPlayer2) return;

    entry.requests.set(userId, socket.id);
    logInfo("[DUEL]", "rematch:request", { userId, sessionId: payload.session_id });

    if (entry.isSolo || entry.requests.size >= 2) {
      if (entry.timer) clearTimeout(entry.timer);
      rematchEntries.delete(payload.session_id);

      const p1: QueueEntry = { ...entry.player1, socketId: entry.requests.get(entry.player1.userId) ?? entry.player1.socketId };
      const p2: QueueEntry = entry.isSolo
        ? { ...entry.player1, socketId: `solo:${p1.socketId}` }
        : { ...entry.player2, socketId: entry.requests.get(entry.player2.userId) ?? entry.player2.socketId };

      finalizeMatch(duel, p1, p2);
    }
  });
}
