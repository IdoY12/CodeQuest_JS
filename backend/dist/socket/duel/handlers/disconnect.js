import { logInfo } from "../../../utils/logger.js";
import { queue, sessions } from "../state.js";
export function registerDisconnect(socket, duel) {
    socket.on("disconnect", () => {
        logInfo("[DUEL]", "socket:disconnected", { socketId: socket.id });
        const queued = queue.findIndex((entry) => entry.socketId === socket.id);
        if (queued >= 0)
            queue.splice(queued, 1);
        sessions.forEach((session, sessionId) => {
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
                        rating_change: 25,
                        xp_earned: 80,
                    });
                    sessions.delete(sessionId);
                }, 5000);
            }
        });
    });
}
