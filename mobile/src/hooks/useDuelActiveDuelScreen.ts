import { useEffect, useRef, useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { applyDuelResult } from "@/redux/duel-slice";
import { hydrateStreak, runStreakAppOpen, runStreakQualifyingExercise } from "@/redux/streak-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { logDuel, logNav } from "@/utils/logger";
import { useDuelActiveDuelLive } from "@/hooks/useDuelSocket";
import { duelSubmitAnswer, duelPlayerReady } from "@/utils/duelSocketCommands";
import { duelConnectionRefs } from "@/utils/duelSocketModels";
import type { DuelStackParamList } from "@/types/duelNavigation.types";
import { DUEL_MAX_ATTEMPTS_PER_ROUND } from "@/constants/duelUiConstants";

type Nav = NativeStackNavigationProp<DuelStackParamList, "ActiveDuel">;

export function useDuelActiveDuelScreen(navigation: Nav) {
  const dispatch = useAppDispatch();
  const { round, score, sessionId, duelEnd, opponent, lastCorrectAnswer } = useDuelActiveDuelLive();
  const userId = useAppSelector((s) => s.session.userId);
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const username = useAppSelector((s) => s.profile.username);
  const opponentName = opponent?.username ?? "Opponent";
  const opponentAvatarUrl = opponent?.avatarUrl ?? null;
  const [roundNumber, setRoundNumber] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const roundStartTimeRef = useRef(Date.now());
  const skipLeaveAfterEndRef = useRef(false);

  useEffect(() => {
    logNav("screen:enter", { screen: "ActiveDuelScreen" });
    return () => logNav("screen:leave", { screen: "ActiveDuelScreen" });
  }, []);

  useEffect(() => {
    setMyScore(score.me);
    setOppScore(score.opp);
  }, [score]);

  useEffect(() => {
    if (!round) return;
    setRoundNumber(round.roundNumber);
    setSelected(null);
    setAttemptCount(0);
    setSubmitted(false);
    roundStartTimeRef.current = Date.now();
  }, [round]);

  useEffect(() => {
    if (sessionId && userId) duelPlayerReady(sessionId);
  }, [sessionId, userId]);

  useEffect(() => {
    if (!duelEnd) return;
    skipLeaveAfterEndRef.current = true;
    logDuel("duel:end", { won: duelEnd.won, xpEarned: duelEnd.xpEarned });
    dispatch(addXp(duelEnd.xpEarned));
    if (isGuest && duelEnd.xpEarned > 0) {
      const today = getStreakCalendarDate();
      dispatch(runStreakAppOpen({ today }));
      dispatch(runStreakQualifyingExercise({ today }));
    } else if (!isGuest && typeof duelEnd.streakCurrent === "number") {
      dispatch(
        hydrateStreak({
          streakCurrent: duelEnd.streakCurrent,
          lastActivityDate: null,
          lastCheckedDate: null,
        }),
      );
    }
    dispatch(applyDuelResult({ won: duelEnd.won }));
    navigation.replace("DuelResults", {
      won: duelEnd.won,
      score: duelEnd.finalScore,
      xpEarned: duelEnd.xpEarned,
      replay: duelEnd.roundReplay,
      ...(duelEnd.opponentDisconnected ? { opponentDisconnected: true } : {}),
    });
  }, [dispatch, duelEnd, isGuest, navigation]);

  useEffect(() => {
    const socket = duelConnectionRefs.socket;
    if (!socket) return;
    const onFeedback = (p: { isCorrect: boolean }) => {
      if (!p.isCorrect) {
        setAttemptCount((c) => c + 1);
        setSubmitted(false);
      }
    };
    socket.on("answer_feedback", onFeedback);
    return () => {
      socket.off("answer_feedback", onFeedback);
    };
  }, []);

  const locked = submitted || attemptCount >= DUEL_MAX_ATTEMPTS_PER_ROUND;
  const overlayVisible = lastCorrectAnswer !== null;
  const submit = (answer: string) => {
    if (!sessionId || !userId || locked) return;
    duelSubmitAnswer({
      sessionId,
      roundNumber,
      answer,
      timeTakenMs: Date.now() - roundStartTimeRef.current,
    });
    setSelected(answer);
    setSubmitted(true);
  };
  return {
    round, username, opponentName, opponentAvatarUrl, roundNumber, selected, myScore, oppScore,
    overlayVisible, lastCorrectAnswer, locked,
    attemptsLeft: DUEL_MAX_ATTEMPTS_PER_ROUND - attemptCount, submit, sessionId, skipLeaveAfterEndRef,
  };
}
