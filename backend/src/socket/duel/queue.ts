import type { Socket } from "socket.io";
import { logInfo } from "../../utils/logger.js";
import { queue, sessions } from "./state.js";
import type { DuelNamespace, QueueEntry } from "./types.js";

export function pickRange(entry: QueueEntry): number {
  const waited = Date.now() - entry.joinedAt;
  if (waited > 60000) return 500;
  if (waited > 30000) return 300;
  return 200;
}

export function handleQueueJoin(socket: Socket, duel: DuelNamespace, entry: QueueEntry): void {
  logInfo("[DUEL]", "queue:join", { userId: entry.userId, socketId: socket.id, rating: entry.rating });
  const opponentIndex = queue.findIndex((candidate) => {
    if (candidate.socketId === entry.socketId) return false;
    const range = Math.max(pickRange(candidate), pickRange(entry));
    return Math.abs(candidate.rating - entry.rating) <= range;
  });

  if (opponentIndex === -1) {
    queue.push(entry);
    socket.emit("queue_status", {
      players_online: Math.max(1, duel.sockets.size),
      estimated_wait_seconds: 12,
    });
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
    readyUserIds: new Set<string>(),
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
