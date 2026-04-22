/**
 * Each socket event handler dispatches exactly one discrete action from `duel-live-slice.ts` per semantic event.
 * Do not reintroduce a batched umbrella merge that accepts arbitrary partial state. When one event legitimately
 * updates several fields (for example a new match resets multiple keys), that coupling stays inside the single
 * reducer for that action in the slice, not as an ad-hoc payload assembled here.
 *
 * Payloads must carry only dynamic values from the wire. Do not echo unchanged fields into the payload; repeating a
 * field can trip strict equality on `useSelector` and cause unnecessary re-renders even when nothing logically
 * changed; repeating a field breaks per-field `useSelector` reference equality and causes re-renders even when nothing
 * logically changed.
 *
 * Read and write runtime refs (`socket`, `userId`, `lastAuthTokenKey`) only via `duelConnectionRefs` in
 * `duelSocketModels.ts`; never dispatch those into Redux, because `Socket` is a non-serializable class instance that would
 * trip Redux Toolkit serialization checks and break persistence, those values never need to drive a React re-render,
 * and they are pure transport plumbing rather than UI state.
 */
import { io, type Socket } from "socket.io-client";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { logDuel, logError } from "@/utils/logger";
import { duelConnectionRefs, normalizeDuelReplayEntry } from "@/utils/duelSocketModels";
import store from "@/redux/store";
import {
  duelEnded,
  matchFound,
  opponentDisconnected,
  playersOnlineSet,
  queueRejected,
  rematchDeclined,
  roundResultReceived,
  roundStarted,
} from "@/redux/duel-live-slice";

export function bindDuelSocketEvents(socket: Socket) {
  socket.on("connect", () => logDuel("socket:connected", { socketId: socket.id }));
  socket.on("disconnect", (reason) => logDuel("socket:disconnected", { reason }));
  socket.on("connect_error", (error) => logError("[DUEL]", error, { phase: "socket-connect" }));
  socket.on("queue_rejected", (p: { reason?: string }) => {
    logDuel("queue:rejected", { reason: p?.reason });
    store.dispatch(queueRejected(p?.reason ?? "auth_required"));
  });
  socket.on("queue_status", (p) => store.dispatch(playersOnlineSet(p.players_online ?? 0)));
  socket.on("match_found", (p) => {
    const opp = p.opponent as { username?: string; avatar_url?: string | null };
    store.dispatch(
      matchFound({
        sessionId: p.session_id,
        opponent: { username: String(opp?.username ?? ""), avatarUrl: typeof opp?.avatar_url === "string" ? opp.avatar_url : null },
      }),
    );
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
          type: q.type ?? "MULTIPLE_CHOICE",
        },
      }),
    );
  });
  socket.on("round_result", (p) => {
    const player1Id = p.player_ids?.player1 as string | undefined;
    const uid = duelConnectionRefs.userId;
    const isP1 = player1Id && uid ? player1Id === uid : true;
    store.dispatch(
      roundResultReceived({
        score: { me: isP1 ? p.scores.player1 : p.scores.player2, opp: isP1 ? p.scores.player2 : p.scores.player1 },
        lastCorrectAnswer: p.correct_answer as string,
      }),
    );
  });
  socket.on("duel_end", (p) => {
    const uid = duelConnectionRefs.userId;
    const keepOd = store.getState().duelLive.duelEnd?.opponentDisconnected === true;
    store.dispatch(
      duelEnded({
        duelEnd: {
          won: uid ? (p.winner_user_id as string) === uid : (p.winner_user_id as string) === socket.id,
          xpEarned: Number(p.xp_earned ?? 0),
          streakCurrent: typeof p.streak_current === "number" ? p.streak_current : typeof p.streak_current === "string" ? Number(p.streak_current) : undefined,
          roundReplay: Array.isArray(p.round_replay) ? p.round_replay.map(normalizeDuelReplayEntry) : [],
          finalScore: `${p.my_score ?? 0}-${p.opp_score ?? 0}`,
          ...(keepOd ? { opponentDisconnected: true } : {}),
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

export function connectDuelSocket(url: string, authToken: string | null): Socket {
  const tokenKey = authToken ?? "";
  if (duelConnectionRefs.socket && duelConnectionRefs.lastAuthTokenKey === tokenKey) return duelConnectionRefs.socket;
  if (duelConnectionRefs.socket) { duelConnectionRefs.socket.removeAllListeners(); duelConnectionRefs.socket.disconnect(); }
  duelConnectionRefs.lastAuthTokenKey = tokenKey;
  const socket = io(url, { transports: ["websocket"], auth: { token: tokenKey } });
  bindDuelSocketEvents(socket);
  duelConnectionRefs.socket = socket;
  return socket;
}
