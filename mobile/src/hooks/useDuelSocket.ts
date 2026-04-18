import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { DUEL_SOCKET_URL } from "../config/network";
import type { DuelState } from "@/utils/duelSocketState";
import { duelRefs } from "@/utils/duelSocketState";
import { connectDuelSocket } from "@/utils/duelSocketIo";
import {
  duelJoinQueue,
  duelLeaveQueue,
  duelPlayerReady,
  duelRequestRematch,
  duelResetMatch,
  duelSetEnd,
  duelSetRound,
  duelSetScore,
  duelSubmitAnswer,
} from "@/utils/duelSocketCommands";

export function useDuelSocket() {
  const [state, setState] = useState<DuelState>(duelRefs.state);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const url = useMemo(() => DUEL_SOCKET_URL, []);

  useEffect(() => {
    connectDuelSocket(url, accessToken);
    const listener = (next: DuelState) => setState(next);
    duelRefs.listeners.add(listener);
    return () => {
      duelRefs.listeners.delete(listener);
    };
  }, [accessToken, url]);

  const joinQueue = useCallback(
    (p: { userId: string; username: string; token?: string | null }) => duelJoinQueue(url, p),
    [url],
  );

  return {
    socket: duelRefs.socket,
    playersOnline: state.playersOnline,
    sessionId: state.sessionId,
    opponent: state.opponent,
    round: state.round,
    score: state.score,
    duelEnd: state.duelEnd,
    rematchStatus: state.rematchStatus,
    lastCorrectAnswer: state.lastCorrectAnswer,
    queueRejected: state.queueRejected,
    setDuelEnd: duelSetEnd,
    setRound: duelSetRound,
    setScore: duelSetScore,
    joinQueue,
    leaveQueue: duelLeaveQueue,
    playerReady: duelPlayerReady,
    submitAnswer: duelSubmitAnswer,
    resetDuel: duelResetMatch,
    requestRematch: duelRequestRematch,
  };
}

export { connectDuelSocket };
