import type { Socket } from "socket.io";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { logInfo } from "../../../utils/logger.js";
import { clearSoloMatchTimer } from "../queue.js";
import { queue, sessions } from "../state.js";
import type { DuelNamespace } from "../types.js";

export function registerDisconnect(socket: Socket, duel: DuelNamespace) {
  socket.on("disconnect", () => {
    logInfo("[DUEL]", "socket:disconnected", { socketId: socket.id });
    const queued = queue.findIndex((entry) => entry.socketId === socket.id);

    if (queued >= 0) queue.splice(queued, 1);
    clearSoloMatchTimer(socket.id);

    sessions.forEach((session, sessionId) => {
      const soloOpponent = session.player2.socketId.startsWith("solo:");
      if (soloOpponent && session.player1.socketId === socket.id) {
        if (session.roundTimeout) {
          clearTimeout(session.roundTimeout);
          session.roundTimeout = null;
        }
        sessions.delete(sessionId);
        return;
      }

      if (session.player1.socketId === socket.id || session.player2.socketId === socket.id) {
        if (session.roundTimeout) {
          clearTimeout(session.roundTimeout);
          session.roundTimeout = null;
        }

        const survivor = session.player1.socketId === socket.id ? session.player2 : session.player1;
        duel.to(survivor.socketId).emit("opponent_disconnected", { at_round: session.round });
        setTimeout(() => {
          duel.to(survivor.socketId).emit("duel_end", {
            winner_user_id: survivor.userId,
            final_scores: { player1: session.score.player1, player2: session.score.player2 },
            xp_earned: XP_PER_CORRECT_EXERCISE,
          });
          sessions.delete(sessionId);
        }, 5000);
      }
    });
  });
}
