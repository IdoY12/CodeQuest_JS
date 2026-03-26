import type { Socket } from "socket.io";
import { logError } from "../../../utils/logger.js";
import { sessions } from "../state.js";
import { startRound } from "../session.js";
import type { DuelNamespace } from "../types.js";

export function registerPlayerReady(socket: Socket, duel: DuelNamespace) {
  socket.on("player_ready", async (payload: { session_id: string; userId?: string }) => {
    try {
      const session = sessions.get(payload.session_id);
      if (!session) return;
      const userId = socket.id === session.player1.socketId ? session.player1.userId : session.player2.userId;
      session.readyUserIds.add(userId);
      if (session.readyUserIds.size >= 2 && session.round === 0) {
        await startRound(duel, session);
      }
    } catch (error) {
      logError("[DUEL]", error, { phase: "player_ready" });
    }
  });
}
