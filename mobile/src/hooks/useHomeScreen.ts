import { useEffect, useMemo } from "react";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { setXpMultiplier } from "@/redux/xp-slice";
import { logNav } from "@/utils/logger";

export function useHomeScreen() {
  const dispatch = useAppDispatcher();
  const username = useAppSelector((s) => s.profile.username);
  const level = useAppSelector((s) => s.xp.level);
  const xp = useAppSelector((s) => s.xp.xpTotal);
  const streak = useAppSelector((s) => s.streak.streakCurrent);
  const streakDays = useAppSelector((s) => s.streak.streakDays);
  const streakShieldAvailable = useAppSelector((s) => s.streak.streakShieldAvailable);
  const multiplierFactor = useAppSelector((s) => s.xp.xpMultiplierFactor);
  const multiplierEndsAt = useAppSelector((s) => s.xp.xpMultiplierEndsAt);
  const studySecondsToday = useAppSelector((s) => s.session.studySecondsToday);
  const commitment = useAppSelector((s) => s.profile.commitment);
  useEffect(() => {
    logNav("screen:enter", { screen: "HomeScreen" });
    return () => logNav("screen:leave", { screen: "HomeScreen" });
  }, []);
  useEffect(() => {
    const now = Date.now();
    if (multiplierEndsAt && multiplierEndsAt > now) return;
    const spawn = new Date().getDay() === 0 || Math.random() < 0.35;
    if (!spawn) {
      dispatch(setXpMultiplier({ factor: 1, endsAt: null }));
      return;
    }
    dispatch(setXpMultiplier({ factor: 2, endsAt: now + 30 * 60 * 1000 }));
  }, [dispatch, multiplierEndsAt]);
  const nextLevelXp = level * 250;
  const currentLevelProgress = useMemo(() => {
    const lf = (level - 1) * 250;
    return Math.min(100, ((xp - lf) / 250) * 100);
  }, [level, xp]);
  const remainingMultiplierMs = multiplierEndsAt ? Math.max(0, multiplierEndsAt - Date.now()) : 0;
  const multiplierMinutes = Math.floor(remainingMultiplierMs / 60000);
  const multiplierSeconds = Math.floor((remainingMultiplierMs % 60000) / 1000);
  const practiceMinutesToday = Math.floor(studySecondsToday / 60);
  const dailyGoalMinutes = Number(commitment);
  const dailyGoalProgressPct = dailyGoalMinutes > 0 ? Math.min(100, (practiceMinutesToday / dailyGoalMinutes) * 100) : 0;
  return {
    username,
    level,
    xp,
    streak,
    streakDays,
    streakShieldAvailable,
    multiplierFactor,
    multiplierEndsAt,
    nextLevelXp,
    currentLevelProgress,
    remainingMultiplierMs,
    multiplierMinutes,
    multiplierSeconds,
    practiceMinutesToday,
    dailyGoalMinutes,
    dailyGoalProgressPct,
  };
}
