/** Incoming duel Socket.IO events — one `duel-live-slice` action per wire event. */
import type { Socket } from "socket.io-client";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { logDuel, logError } from "@/utils/logger";
import { duelConnectionRefs, normalizeDuelReplayEntry } from "@/utils/duelSocketModels";
import store from "@/redux/store";
import {
  duelEnded, matchFound, opponentDisconnected, playersOnlineSet, queueRejected, rematchDeclined,
  roundResultReceived, roundStarted,
} from "@/redux/duel-live-slice";

export function bindDuelSocketEvents(socket: Socket) {
  socket.on("connect", () => logDuel("socket:connected", { socketId: socket.id }));
  socket.on("disconnect", (reason) => logDuel("socket:disconnected", { reason }));
  socket.on("connect_error", (e) => logError("[DUEL]", e, { phase: "socket-connect" }));
  socket.on("queue_rejected", (p: { reason?: string }) => {
    logDuel("queue:rejected", { reason: p?.reason });
    store.dispatch(queueRejected(p?.reason ?? "auth_required"));
  });
  socket.on("queue_status", (p) => store.dispatch(playersOnlineSet(p.players_online ?? 0)));
  socket.on("match_found", (p) => {
    const o = p.opponent as { username?: string; avatar_url?: string | null };
    const un = String(o?.username ?? "");
    const av = typeof o?.avatar_url === "string" ? o.avatar_url : null;
    store.dispatch(matchFound({ sessionId: p.session_id, opponent: { username: un, avatarUrl: av } }));
  });
  socket.on("round_start", (p) => {
    const q = p.question ?? {};
    store.dispatch(
      roundStarted({
        round: {
          roundNumber: p.round_number,
          prompt: q.prompt,
          codeSnippet: q.code_snippet,
          options: q.options ?? [],
          correctAnswer: q.correct_answer,
          type: q.type ?? "MCQ",
        },
      }),
    );
  });
  socket.on("round_result", (p) => {
    const p1 = p.player_ids?.player1 as string | undefined;
    const uid = duelConnectionRefs.userId;
    const first = p1 && uid ? p1 === uid : true;
    const me = first ? p.scores.player1 : p.scores.player2;
    const opp = first ? p.scores.player2 : p.scores.player1;
    store.dispatch(roundResultReceived({ score: { me, opp }, lastCorrectAnswer: p.correct_answer as string }));
  });
  socket.on("duel_end", (p) => {
    const uid = duelConnectionRefs.userId;
    const od = store.getState().duelLive.duelEnd?.opponentDisconnected === true;
    const sc = p.streak_current;
    const streak = typeof sc === "number" ? sc : typeof sc === "string" ? Number(sc) : undefined;
    const replay = Array.isArray(p.round_replay) ? p.round_replay.map(normalizeDuelReplayEntry) : [];
    store.dispatch(
      duelEnded({
        duelEnd: {
          won: uid ? (p.winner_user_id as string) === uid : (p.winner_user_id as string) === socket.id,
          xpEarned: Number(p.xp_earned ?? 0),
          streakCurrent: streak,
          roundReplay: replay,
          finalScore: `${p.my_score ?? 0}-${p.opp_score ?? 0}`,
          ...(od ? { opponentDisconnected: true } : {}),
        },
      }),
    );
  });
  socket.on("opponent_disconnected", () => {
    logDuel("opponent:disconnected");
    store.dispatch(opponentDisconnected({ xpEarned: XP_PER_CORRECT_EXERCISE }));
  });
  socket.on("rematch_declined", () => store.dispatch(rematchDeclined()));
}
