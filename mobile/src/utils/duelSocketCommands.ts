import type { DuelRound, DuelState } from "@/utils/duelSocketState";
import { duelRefs, publishDuel } from "@/utils/duelSocketState";
import { connectDuelSocket } from "@/utils/duelSocketIo";

export function duelScheduleLocalMockRound(timerRef: { current: ReturnType<typeof setTimeout> | null }) {
  publishDuel({
    sessionId: duelRefs.state.sessionId ?? "local-session",
    opponent: duelRefs.state.opponent ?? { username: "GlobalRival", rating: 1210 },
  });
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => {
    publishDuel({
      round: {
        roundNumber: 1,
        prompt: "What is the output?",
        codeSnippet: "console.log(typeof null);",
        options: ["object", "null", "undefined", "number"],
        correctAnswer: "object",
        type: "MULTIPLE_CHOICE",
      },
    });
  }, 900);
}

export function duelJoinQueue(
  url: string,
  payload: { userId: string; username: string; rating: number; token?: string | null },
) {
  const socket = connectDuelSocket(url, payload.token ?? null);
  duelRefs.userId = payload.userId;
  socket.emit("join_queue", { rating: payload.rating, username: payload.username });
}

export function duelLeaveQueue() {
  duelRefs.socket?.emit("leave_queue");
}

export function duelPlayerReady(sessionId: string) {
  duelRefs.socket?.emit("player_ready", { session_id: sessionId });
}

export function duelSubmitAnswer(payload: {
  sessionId: string;
  roundNumber: number;
  answer: string;
  timeTakenMs: number;
}) {
  duelRefs.socket?.emit("submit_answer", {
    session_id: payload.sessionId,
    round_number: payload.roundNumber,
    answer: payload.answer,
    time_taken_ms: payload.timeTakenMs,
  });
}

export function duelResetMatch() {
  publishDuel({ sessionId: null, opponent: null, round: null, score: { me: 0, opp: 0 }, duelEnd: null });
}

export function duelSetEnd(duelEnd: DuelState["duelEnd"]) {
  publishDuel({ duelEnd });
}

export function duelSetRound(round: DuelRound | null) {
  publishDuel({ round });
}

export function duelSetScore(score: DuelState["score"]) {
  publishDuel({ score });
}
