import { io, type Socket } from "socket.io-client";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { logDuel, logError } from "@/utils/logger";
import { duelRefs, publishDuel, normalizeDuelReplayEntry } from "@/utils/duelSocketState";

export function bindDuelSocketEvents(socket: Socket) {
  socket.on("connect", () => logDuel("socket:connected", { socketId: socket.id }));
  socket.on("disconnect", (reason) => logDuel("socket:disconnected", { reason }));
  socket.on("connect_error", (error) => logError("[DUEL]", error, { phase: "socket-connect" }));
  socket.on("queue_rejected", (p: { reason?: string }) => {
    logDuel("queue:rejected", { reason: p?.reason });
    publishDuel({ queueRejected: p?.reason ?? "auth_required" });
  });
  socket.on("queue_status", (p) => publishDuel({ playersOnline: p.players_online ?? 0 }));
  socket.on("match_found", (p) => {
    const opp = p.opponent as { username?: string; avatar_url?: string | null };
    publishDuel({
      sessionId: p.session_id,
      opponent: { username: String(opp?.username ?? ""), avatarUrl: typeof opp?.avatar_url === "string" ? opp.avatar_url : null },
      round: null, score: { me: 0, opp: 0 }, duelEnd: null, rematchStatus: null, lastCorrectAnswer: null, queueRejected: null,
    });
  });
  socket.on("round_start", (p) => {
    const q = p.question ?? {};
    publishDuel({ round: { roundNumber: p.round_number, prompt: q.prompt, codeSnippet: q.code_snippet, options: q.options ?? [], correctAnswer: q.correct_answer, type: q.type ?? "MULTIPLE_CHOICE" }, lastCorrectAnswer: null });
  });
  socket.on("round_result", (p) => {
    const player1Id = p.player_ids?.player1 as string | undefined;
    const uid = duelRefs.userId;
    const isP1 = player1Id && uid ? player1Id === uid : true;
    publishDuel({ score: { me: isP1 ? p.scores.player1 : p.scores.player2, opp: isP1 ? p.scores.player2 : p.scores.player1 }, lastCorrectAnswer: p.correct_answer as string });
  });
  socket.on("duel_end", (p) => {
    const uid = duelRefs.userId;
    publishDuel({
      duelEnd: {
        won: uid ? (p.winner_user_id as string) === uid : (p.winner_user_id as string) === socket.id,
        xpEarned: Number(p.xp_earned ?? 0),
        streakCurrent: typeof p.streak_current === "number" ? p.streak_current : typeof p.streak_current === "string" ? Number(p.streak_current) : undefined,
        roundReplay: Array.isArray(p.round_replay) ? p.round_replay.map(normalizeDuelReplayEntry) : [],
        finalScore: `${p.my_score ?? 0}-${p.opp_score ?? 0}`,
      },
    });
  });
  socket.on("opponent_disconnected", () => {
    logDuel("opponent:disconnected");
    publishDuel({ duelEnd: { won: true, xpEarned: XP_PER_CORRECT_EXERCISE, roundReplay: [], finalScore: "W-0" } });
  });
  socket.on("rematch_declined", () => publishDuel({ rematchStatus: "opponent_left" }));
}

export function connectDuelSocket(url: string, authToken: string | null): Socket {
  const tokenKey = authToken ?? "";
  if (duelRefs.socket && duelRefs.lastAuthTokenKey === tokenKey) return duelRefs.socket;
  if (duelRefs.socket) { duelRefs.socket.removeAllListeners(); duelRefs.socket.disconnect(); }
  duelRefs.lastAuthTokenKey = tokenKey;
  const socket = io(url, { transports: ["websocket"], auth: { token: tokenKey } });
  bindDuelSocketEvents(socket);
  duelRefs.socket = socket;
  return socket;
}
