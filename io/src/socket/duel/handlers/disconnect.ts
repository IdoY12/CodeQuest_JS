import type { Socket } from "socket.io";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { logInfo } from "../../../utils/logger.js";
import { clearSoloMatchTimer } from "../queue.js";
import { queue, sessions, rematchEntries } from "../state.js";
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
        sessions.delete(sessionId);
        return;
      }

      if (session.player1.socketId === socket.id || session.player2.socketId === socket.id) {
        const survivor = session.player1.socketId === socket.id ? session.player2 : session.player1;
        duel.to(survivor.socketId).emit("opponent_disconnected", { at_round: session.round });
        setTimeout(() => {
          duel.to(survivor.socketId).emit("duel_end", {
            winner_user_id: survivor.userId,
            my_score: survivor.socketId === session.player1.socketId ? session.score.player1 : session.score.player2,
            opp_score: survivor.socketId === session.player1.socketId ? session.score.player2 : session.score.player1,
            xp_earned: XP_PER_CORRECT_EXERCISE,
          });
          sessions.delete(sessionId);
        }, 5000);
      }
    });

    rematchEntries.forEach((entry, sessionId) => {
      const isPlayer1 = entry.player1.socketId === socket.id;
      const isPlayer2 = entry.player2.socketId === socket.id;
      if (!isPlayer1 && !isPlayer2) return;

      if (entry.timer) clearTimeout(entry.timer);
      rematchEntries.delete(sessionId);

      const waitingSocketId = isPlayer1
        ? entry.requests.get(entry.player2.userId)
        : entry.requests.get(entry.player1.userId);
      if (waitingSocketId) duel.to(waitingSocketId).emit("rematch_declined", { reason: "opponent_left" });
    });
  });
}
