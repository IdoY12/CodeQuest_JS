import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/utils/logger";
import { buildStreakDotHighlights, shouldShowStreakDotRow } from "@/utils/dailyXpStreakCore";

export function useHomeScreen() {
  const username = useAppSelector((s) => s.profile.username);
  const level = useAppSelector((s) => s.xp.level);
  const xp = useAppSelector((s) => s.xp.xpTotal);
  const streak = useAppSelector((s) => s.streak.streakCurrent);
  const streakDotsFilled = useMemo(() => buildStreakDotHighlights(streak), [streak]);
  const streakShowsDots = shouldShowStreakDotRow(streak);
  const studySecondsToday = useAppSelector((s) => s.session.studySecondsToday);
  const commitment = useAppSelector((s) => s.profile.commitment);

  useEffect(() => {
    logNav("screen:enter", { screen: "HomeScreen" });
    return () => logNav("screen:leave", { screen: "HomeScreen" });
  }, []);

  const nextLevelXp = level * XP_PER_CORRECT_EXERCISE;
  const currentLevelProgress = useMemo(() => {
    const lf = (level - 1) * XP_PER_CORRECT_EXERCISE;
    return Math.min(100, ((xp - lf) / XP_PER_CORRECT_EXERCISE) * 100);
  }, [level, xp]);
  const practiceMinutesToday = Math.floor(studySecondsToday / 60);
  const dailyGoalMinutes = Number(commitment);
  const dailyGoalProgressPct = dailyGoalMinutes > 0 ? Math.min(100, (practiceMinutesToday / dailyGoalMinutes) * 100) : 0;

  return {
    username,
    level,
    xp,
    streak,
    streakDotsFilled,
    streakShowsDots,
    nextLevelXp,
    currentLevelProgress,
    practiceMinutesToday,
    dailyGoalMinutes,
    dailyGoalProgressPct,
  };
}
