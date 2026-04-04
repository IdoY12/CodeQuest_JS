import { useEffect, useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { applyDuelResult } from "@/redux/duel-slice";
import { logDuel, logNav } from "@/services/logger";
import { useDuelSocket } from "@/hooks/useDuelSocket";
import type { DuelStackParamList } from "@/types/duelNavigation.types";
import { DUEL_ACTIVE_ROUND_SECONDS } from "@/constants/duelUiConstants";

type Nav = NativeStackNavigationProp<DuelStackParamList, "ActiveDuel">;
export function useDuelActiveDuelScreen(navigation: Nav) {
  const dispatch = useAppDispatcher();
  const { round, score, sessionId, submitAnswer, playerReady, duelEnd, opponent } = useDuelSocket();
  const userId = useAppSelector((s) => s.session.userId);
  const username = useAppSelector((s) => s.profile.username);
  const opponentName = opponent?.username ?? "Opponent";
  const [roundNumber, setRoundNumber] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(DUEL_ACTIVE_ROUND_SECONDS);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  useEffect(() => {
    logNav("screen:enter", { screen: "ActiveDuelScreen" });
    return () => logNav("screen:leave", { screen: "ActiveDuelScreen" });
  }, []);
  useEffect(() => {
    setMyScore(score.me);
    setOppScore(score.opp);
    if (round) {
      setOverlayVisible(true);
      const t = setTimeout(() => setOverlayVisible(false), 1600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [score]);
  useEffect(() => {
    if (round) {
      setRoundNumber(round.roundNumber);
      setSelected(null);
    }
  }, [round]);
  useEffect(() => {
    if (sessionId && userId) playerReady(sessionId);
  }, [playerReady, sessionId, userId]);
  useEffect(() => {
    if (!duelEnd) return;
    logDuel("duel:end", { won: duelEnd.won, xpEarned: duelEnd.xpEarned });
    dispatch(addXp(duelEnd.xpEarned));
    dispatch(applyDuelResult({ won: duelEnd.won, ratingDelta: duelEnd.ratingDelta }));
    navigation.replace("DuelResults", { won: duelEnd.won, score: `${myScore}-${oppScore}`, replay: duelEnd.roundReplay });
  }, [dispatch, duelEnd, myScore, navigation, oppScore]);
  useEffect(() => {
    setTimeLeft(DUEL_ACTIVE_ROUND_SECONDS);
    const i = setInterval(() => setTimeLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(i);
  }, [roundNumber]);
  const submit = (answer: string) => {
    if (!sessionId || !userId) return;
    submitAnswer({ sessionId, roundNumber, answer, timeTakenMs: (DUEL_ACTIVE_ROUND_SECONDS - timeLeft) * 1000 });
    setSelected(answer);
  };
  return {
    round,
    username,
    opponentName,
    roundNumber,
    selected,
    timeLeft,
    myScore,
    oppScore,
    overlayVisible,
    submit,
  };
}
