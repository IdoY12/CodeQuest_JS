/**
 * Imperative commands in this module are invoked by the UI to emit on the socket or dispatch to Redux; each path that
 * mutates live duel state dispatches exactly one discrete action from `duel-live-slice.ts` per operation—this file is not
 * where incoming socket events are handled.
 *
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
import { duelConnectionRefs } from "@/utils/duelSocketModels";
import { connectDuelSocket } from "@/utils/duelSocketIo";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import store from "@/redux/store";
import { duelReset } from "@/redux/duel-live-slice";

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
  duelConnectionRefs.userId = payload.userId;
  emitJoinQueueWhenReady(socket, payload.username);
}

export function duelLeaveQueue() {
  duelConnectionRefs.socket?.emit("leave_queue");
}

export function duelLeaveDuel(sessionId: string) {
  duelConnectionRefs.socket?.emit("leave_duel", { session_id: sessionId });
}

export function duelPlayerReady(sessionId: string) {
  duelConnectionRefs.socket?.emit("player_ready", {
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
  duelConnectionRefs.socket?.emit("submit_answer", {
    session_id: payload.sessionId,
    round_number: payload.roundNumber,
    answer: payload.answer,
    time_taken_ms: payload.timeTakenMs,
    streak_local_date: getStreakCalendarDate(),
  });
}

export function duelResetMatch() {
  store.dispatch(duelReset());
}

export function duelRequestRematch(sessionId: string) {
  duelConnectionRefs.socket?.emit("rematch_request", { session_id: sessionId });
}
