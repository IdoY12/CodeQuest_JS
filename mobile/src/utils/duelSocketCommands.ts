import type { DuelRound, DuelState } from "@/utils/duelSocketState";
import { duelRefs, publishDuel } from "@/utils/duelSocketState";
import { connectDuelSocket } from "@/utils/duelSocketIo";
import { getStreakCalendarDate } from "@/utils/streakCalendar";

function emitJoinQueueWhenReady(socket: ReturnType<typeof connectDuelSocket>, username: string): void {
  const body = { username };
  if (socket.connected) {
    socket.emit("join_queue", body);
    return;
  }
  socket.once("connect", () => {
    socket.emit("join_queue", body);
  });
}

export function duelJoinQueue(url: string, payload: { userId: string; username: string; token?: string | null }) {
  const socket = connectDuelSocket(url, payload.token ?? null);
  duelRefs.userId = payload.userId;
  emitJoinQueueWhenReady(socket, payload.username);
}

export function duelLeaveQueue() {
  duelRefs.socket?.emit("leave_queue");
}

export function duelPlayerReady(sessionId: string) {
  duelRefs.socket?.emit("player_ready", {
    session_id: sessionId,
    streak_local_date: getStreakCalendarDate(),
  });
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
    streak_local_date: getStreakCalendarDate(),
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
