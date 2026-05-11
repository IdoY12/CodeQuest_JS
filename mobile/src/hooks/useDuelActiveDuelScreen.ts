import { useEffect, useRef, useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { applyDuelResult } from "@/redux/duel-slice";
import { hydrateStreak, runStreakAppOpen, runStreakQualifyingExercise } from "@/redux/streak-slice";
import { opponentDisconnected } from "@/redux/duel-live-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { logDuel, logNav } from "@/utils/logger";
import { useDuelActiveDuelLive } from "@/hooks/useDuelSocket";
import { duelSubmitAnswer, duelPlayerReady } from "@/utils/duelSocketCommands";
import type { DuelStackParamList } from "@/types/duelNavigation.types";
import { DUEL_MAX_ATTEMPTS_PER_ROUND } from "@project/duel-constants";
type Nav = NativeStackNavigationProp<DuelStackParamList, "ActiveDuel">;

export function useDuelActiveDuelScreen(navigation: Nav) {
  const dispatch = useAppDispatch();
  const { round, score, sessionId, duelEnd, opponent, lastCorrectAnswer, wrongAnswerCount, opponentLeft } = useDuelActiveDuelLive();
  const userId = useAppSelector((s) => s.session.userId);
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const username = useAppSelector((s) => s.profile.username);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const roundStartTimeRef = useRef(Date.now());
  const skipLeaveAfterEndRef = useRef(false);

  useEffect(() => { logNav("screen:enter", { screen: "ActiveDuelScreen" }); return () => logNav("screen:leave", { screen: "ActiveDuelScreen" }); }, []);

  useEffect(() => {
    if (!round) return;
    setSelected(null);
    setSubmitted(false);
    roundStartTimeRef.current = Date.now();
  }, [round]);
  // Unlock after each server-confirmed wrong answer so the player can retry.
  useEffect(() => { setSubmitted(false); }, [wrongAnswerCount]);

  useEffect(() => {
    if (sessionId && userId) duelPlayerReady(sessionId);
  }, [sessionId, userId]);

  // If round_start never arrives within 15 s, surface the "Opponent left" results screen.
  useEffect(() => {
    if (round !== null) return;
    const id = setTimeout(() => dispatch(opponentDisconnected({ xpEarned: 0 })), 15_000);
    return () => clearTimeout(id);
  }, [dispatch, round]);

  useEffect(() => {
    if (!duelEnd) return;
    skipLeaveAfterEndRef.current = true;
    logDuel("duel:end", { won: duelEnd.won, xpEarned: duelEnd.xpEarned });
    dispatch(addXp(duelEnd.xpEarned));
    const today = getStreakCalendarDate();
    if (isGuest && duelEnd.xpEarned > 0) {
      dispatch(runStreakAppOpen({ today }));
      dispatch(runStreakQualifyingExercise({ today }));
    } else if (!isGuest && typeof duelEnd.streakCurrent === "number") {
      dispatch(hydrateStreak({ streakCurrent: duelEnd.streakCurrent, lastActivityDate: today, lastCheckedDate: today }));
    }
    if (!duelEnd.tied) dispatch(applyDuelResult({ won: duelEnd.won }));
    navigation.replace("DuelResults", { won: duelEnd.won, score: duelEnd.finalScore, xpEarned: duelEnd.xpEarned, replay: duelEnd.roundReplay, ...(duelEnd.opponentDisconnected ? { opponentDisconnected: true } : {}), ...(duelEnd.tied ? { tied: true } : {}) });
  }, [dispatch, duelEnd, isGuest, navigation]);
  const locked = lastCorrectAnswer !== null || submitted || wrongAnswerCount >= DUEL_MAX_ATTEMPTS_PER_ROUND;
  const submit = (answer: string) => {
    if (!sessionId || !userId || locked) return;
    duelSubmitAnswer({ sessionId, roundNumber: round?.roundNumber ?? 0, answer, timeTakenMs: Date.now() - roundStartTimeRef.current });
    setSelected(answer);
    setSubmitted(true);
  };

  return {
    round, username, opponentName: opponent?.username ?? "Opponent", opponentAvatarUrl: opponent?.avatarUrl ?? null,
    roundNumber: round?.roundNumber ?? 0, selected, myScore: score.me, oppScore: score.opp,
    overlayVisible: lastCorrectAnswer !== null, lastCorrectAnswer, locked,
    attemptsLeft: DUEL_MAX_ATTEMPTS_PER_ROUND - wrongAnswerCount, submit, sessionId, skipLeaveAfterEndRef, opponentLeft,
  };
}
