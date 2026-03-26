import { logInfo } from "../../utils/logger.js";
import { queue, sessions } from "./state.js";
/**
 * Computes how wide the matchmaking rating gap is allowed to be, based on how long
 * the player has already been waiting in the queue.
 *
 * `joinedAt` is the timestamp (in ms) when the entry was added to the queue.
 * `Date.now() - joinedAt` gives the waiting time (also in ms) since they joined.
 * As wait time increases, we widen the accepted rating difference so matching
 * becomes more likely over time.
 *
 * Returns the allowed absolute rating difference:
 * - after > 60s => 500
 * - after > 30s => 300
 * - otherwise => 200
 */
export function pickRange(entry) {
    const waited = Date.now() - entry.joinedAt;
    if (waited > 60000)
        return 500;
    if (waited > 30000)
        return 300;
    return 200;
}
export function handleQueueJoin(socket, duel, entry) {
    logInfo("[DUEL]", "queue:join", { userId: entry.userId, socketId: socket.id, rating: entry.rating });
    const opponentIndex = queue.findIndex((candidate) => {
        // Skip matching the player with themselves (same socketId).
        if (candidate.socketId === entry.socketId)
            return false;
        // Compute the allowed rating gap for this matchup.
        // As players wait longer, pickRange() grows, so matchmaking becomes more flexible over time.
        // We use the larger range so the pair can match if BOTH are within the widening threshold.
        const range = Math.max(pickRange(candidate), pickRange(entry));
        // `rating` is the player's matchmaking rating stored on QueueEntry.
        // Example: candidate.rating = 1050, entry.rating = 1000.
        // `candidate.rating - entry.rating` is how far apart they are (positive/negative).
        // `Math.abs(...)` converts it to an absolute gap number (0..infinity).
        // We match only if that absolute rating gap is <= the allowed gap `range`.
        return Math.abs(candidate.rating - entry.rating) <= range;
    });
    if (opponentIndex === -1) {
        // No suitable opponent found yet, so add this player to the queue.
        queue.push(entry);
        // Notify the client about current queue stats (players online).
        socket.emit("queue_status", {
            // How many sockets are currently connected in the duel namespace (min 1 for UI).
            players_online: Math.max(1, duel.sockets.size),
        });
        // Stop here; we'll only start a duel when an opponent is found later.
        return;
    }
    const opponent = queue.splice(opponentIndex, 1)[0];
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const roomId = `duel_${sessionId}`;
    const opponentSocket = duel.sockets.get(opponent.socketId);
    opponentSocket?.join(roomId);
    socket.join(roomId);
    sessions.set(sessionId, {
        sessionId,
        roomId,
        player1: opponent,
        player2: entry,
        score: { player1: 0, player2: 0 },
        round: 0,
        readyUserIds: new Set(),
        currentQuestionId: null,
        answered: false,
        roundTimeout: null,
        roundNonce: 0,
        roundReplay: [],
    });
    logInfo("[DUEL]", "match:created", {
        sessionId,
        player1: opponent.userId,
        player2: entry.userId,
    });
    duel.to(opponent.socketId).emit("match_found", {
        session_id: sessionId,
        opponent: { username: entry.username, avatar_id: entry.avatarId, rating: entry.rating },
    });
    socket.emit("match_found", {
        session_id: sessionId,
        opponent: { username: opponent.username, avatar_id: opponent.avatarId, rating: opponent.rating },
    });
}
