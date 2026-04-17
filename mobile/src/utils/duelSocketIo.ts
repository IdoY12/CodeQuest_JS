import { io, type Socket } from "socket.io-client";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { logDuel, logError } from "@/utils/logger";
import { duelRefs, publishDuel, normalizeDuelReplayEntry } from "@/utils/duelSocketState";

export function bindDuelSocketEvents(socket: Socket) {
  socket.on("connect", () => logDuel("socket:connected", { socketId: socket.id }));
  socket.on("disconnect", (reason) => logDuel("socket:disconnected", { reason }));
  socket.on("connect_error", (error) => logError("[DUEL]", error, { phase: "socket-connect" }));
  socket.on("queue_rejected", (payload: { reason?: string }) => {
    logDuel("queue:rejected", { reason: payload?.reason });
  });
  socket.on("queue_status", (payload) => publishDuel({ playersOnline: payload.players_online ?? 0 }));
  socket.on("match_found", (payload) => {
    const opp = payload.opponent as {
      username?: string;
      avatar_url?: string | null;
    };
    publishDuel({
      sessionId: payload.session_id,
      opponent: {
        username: String(opp?.username ?? ""),
        avatarUrl: typeof opp?.avatar_url === "string" ? opp.avatar_url : null,
      },
    });
  });
  socket.on("round_start", (payload) => {
    const question = payload.question ?? {};
    publishDuel({
      round: {
        roundNumber: payload.round_number,
        prompt: question.prompt,
        codeSnippet: question.code_snippet,
        options: question.options ?? [],
        correctAnswer: question.correct_answer,
        type: question.type ?? "MULTIPLE_CHOICE",
      },
    });
  });
  socket.on("round_result", (payload) => {
    const player1Id = payload.player_ids?.player1 as string | undefined;
    const uid = duelRefs.userId;
    const isPlayer1 = player1Id && uid ? player1Id === uid : true;
    publishDuel({
      score: {
        me: isPlayer1 ? payload.scores.player1 : payload.scores.player2,
        opp: isPlayer1 ? payload.scores.player2 : payload.scores.player1,
      },
    });
  });
  socket.on("duel_end", (payload) => {
    const winnerId = payload.winner_user_id as string;
    const uid = duelRefs.userId;
    publishDuel({
      duelEnd: {
        won: uid ? winnerId === uid : winnerId === socket.id,
        xpEarned: Number(payload.xp_earned ?? 0),
        streakCurrent:
          typeof payload.streak_current === "number"
            ? payload.streak_current
            : typeof payload.streak_current === "string"
              ? Number(payload.streak_current)
              : undefined,
        roundReplay: Array.isArray(payload.round_replay) ? payload.round_replay.map(normalizeDuelReplayEntry) : [],
      },
    });
  });
  socket.on("opponent_disconnected", () => {
    logDuel("opponent:disconnected");
    publishDuel({ duelEnd: { won: true, xpEarned: XP_PER_CORRECT_EXERCISE, roundReplay: [] } });
  });
}

export function connectDuelSocket(url: string, authToken: string | null): Socket {
  const tokenKey = authToken ?? "";
  if (duelRefs.socket && duelRefs.lastAuthTokenKey === tokenKey) return duelRefs.socket;

  if (duelRefs.socket) {
    duelRefs.socket.removeAllListeners();
    duelRefs.socket.disconnect();
  }
  duelRefs.lastAuthTokenKey = tokenKey;
  const socket = io(url, { transports: ["websocket"], auth: { token: tokenKey } });
  bindDuelSocketEvents(socket);
  duelRefs.socket = socket;
  return socket;
}
