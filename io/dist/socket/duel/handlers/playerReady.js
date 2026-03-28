import { logError } from "../../../utils/logger.js";
import { sessions } from "../state.js";
import { startRound } from "../session.js";
export function registerPlayerReady(socket, duel) {
    socket.on("player_ready", async (payload) => {
        try {
            const session = sessions.get(payload.session_id);
            if (!session)
                return;
            const userId = socket.id === session.player1.socketId ? session.player1.userId : session.player2.userId;
            session.readyUserIds.add(userId);
            if (session.readyUserIds.size >= 2 && session.round === 0) {
                await startRound(duel, session);
            }
        }
        catch (error) {
            logError("[DUEL]", error, { phase: "player_ready" });
        }
    });
}
