/**
 * Each hook here is a per-screen bundle of `duelLive` selectors plus stable action imports. Bundles are
 * grouped by consumer screen, not by domain. Do not reuse an existing bundle from a screen that reads only a
 * subset of its fields; that ties the screen to unrelated updates and defeats field-level subscriptions; reusing that
 * bundle on another screen ties that screen to updates of fields it never reads and reintroduces the fan-out re-render
 * bug this architecture removes. For a new
 * screen that needs fewer fields, either call `useAppSelector` inline for those fields only, or add another
 * narrowly scoped hook in this file. Extend a bundle with a new selected field only if every current consumer of
 * that bundle actually reads that field; otherwise add a new bundle or a standalone selector hook.
 *
 * Selectors here must return primitives or direct references from `state.duelLive` (for example `s.duelLive.round`).
 * Do not return a newly allocated object or array from a selector body (patterns like `s => ({ a: s.duelLive.x })`
 * or `s => [a, b]`) because that creates a new reference every run and forces re-renders on unrelated dispatches.
 *
 * Callbacks exposed from these hooks must stay stable: module-level functions from `duelSocketCommands`, or
 * `useCallback` with correct dependencies. Unstable callbacks can break memoized children and confuse effect deps.
 *
 * Runtime connection refs (`socket`, `userId`, `lastAuthTokenKey`) live on `duelConnectionRefs` in the utils layer
 * and are intentionally not in Redux; keep them there.
 */
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import store from "@/redux/store";
import { DUEL_SOCKET_URL } from "../config/network";
import { duelConnectionRefs } from "@/utils/duelSocketModels";
import { connectDuelSocket } from "@/utils/duelSocketIo";
import { refreshSessionOrLogoutOnForeground } from "@/utils/appShellPersistence";
import { duelJoinQueue, duelLeaveQueue, duelRequestRematch, duelResetMatch } from "@/utils/duelSocketCommands";

export function useDuelSocketBootstrap() {
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const url = useMemo(() => DUEL_SOCKET_URL, []);
  useEffect(() => {
    connectDuelSocket(url, accessToken);
  }, [accessToken, url]);
}

export function useDuelResetDuel() {
  return { resetDuel: duelResetMatch };
}

export function useDuelMatchmakingSocket() {
  const dispatch = useAppDispatch();
  const playersOnline = useAppSelector((s) => s.duelLive.playersOnline);
  const sessionId = useAppSelector((s) => s.duelLive.sessionId);
  const opponent = useAppSelector((s) => s.duelLive.opponent);
  const queueRejected = useAppSelector((s) => s.duelLive.queueRejected);
  const url = useMemo(() => DUEL_SOCKET_URL, []);

  // Ensure the session is refreshed before joining the queue.
  // We access the store directly via getState() to bypass the stale closure of the hook,
  // ensuring we capture the updated token immediately after the async refresh.
  const joinQueue = useCallback(
    async (p: { userId: string; username: string; token?: string | null }) => {
      await refreshSessionOrLogoutOnForeground(p.token ?? "", dispatch);
      const next = store.getState().session.accessToken;
      if (!next) return;
      duelJoinQueue(url, { ...p, token: next });
    },
    [dispatch, url],
  );
  
  return { playersOnline, sessionId, opponent, joinQueue, leaveQueue: duelLeaveQueue, queueRejected };
}

export function useDuelResultsSocket() {
  const sessionId = useAppSelector((s) => s.duelLive.sessionId);
  const rematchStatus = useAppSelector((s) => s.duelLive.rematchStatus);
  return {
    sessionId,
    rematchStatus,
    requestRematch: duelRequestRematch,
    resetDuel: duelResetMatch,
    socket: duelConnectionRefs.socket,
  };
}

export function useDuelActiveDuelLive() {
  const round = useAppSelector((s) => s.duelLive.round);
  const score = useAppSelector((s) => s.duelLive.score);
  const sessionId = useAppSelector((s) => s.duelLive.sessionId);
  const duelEnd = useAppSelector((s) => s.duelLive.duelEnd);
  const opponent = useAppSelector((s) => s.duelLive.opponent);
  const lastCorrectAnswer = useAppSelector((s) => s.duelLive.lastCorrectAnswer);
  return { round, score, sessionId, duelEnd, opponent, lastCorrectAnswer };
}

export { connectDuelSocket };
