/** Per-screen selector bundles for duel-live state. Each bundle selects only the fields its screen renders.
 * Do not return new objects/arrays from selector bodies — use direct state references only.
 * Runtime socket/userId refs live in duelConnectionRefs (duelSocketModels.ts), not Redux. */
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import store from "@/redux/store";
import { DUEL_SOCKET_URL } from "../config/network";
import { duelConnectionRefs } from "@/utils/duelSocketModels";
import { connectDuelSocket } from "@/utils/duelSocketIo";
import { refreshSessionOrLogoutOnForeground } from "@/utils/appShellPersistence";
import { duelJoinQueue, duelLeaveQueue, duelRequestRematch } from "@/utils/duelSocketCommands";

export function useDuelSocketBootstrap() {
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const url = useMemo(() => DUEL_SOCKET_URL, []);
  useEffect(() => {
    connectDuelSocket(url, accessToken);
    return () => {
      duelConnectionRefs.socket?.disconnect();
      duelConnectionRefs.socket = null;
    };
  }, [accessToken, url]);
}

export function useDuelMatchmakingSocket() {
  const dispatch = useAppDispatch();
  const playersOnline = useAppSelector((s) => s.duelLive.playersOnline);
  const sessionId = useAppSelector((s) => s.duelLive.sessionId);
  const opponent = useAppSelector((s) => s.duelLive.opponent);
  const queueRejected = useAppSelector((s) => s.duelLive.queueRejected);
  const url = useMemo(() => DUEL_SOCKET_URL, []);
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
  return { sessionId, rematchStatus, requestRematch: duelRequestRematch };
}

export function useDuelActiveDuelLive() {
  const round = useAppSelector((s) => s.duelLive.round);
  const score = useAppSelector((s) => s.duelLive.score);
  const sessionId = useAppSelector((s) => s.duelLive.sessionId);
  const duelEnd = useAppSelector((s) => s.duelLive.duelEnd);
  const opponent = useAppSelector((s) => s.duelLive.opponent);
  const lastCorrectAnswer = useAppSelector((s) => s.duelLive.lastCorrectAnswer);
  const wrongAnswerCount = useAppSelector((s) => s.duelLive.wrongAnswerCount);
  return { round, score, sessionId, duelEnd, opponent, lastCorrectAnswer, wrongAnswerCount };
}
