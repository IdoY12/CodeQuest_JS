import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/utils/logger";

export function useHomeScreen() {
  const username = useAppSelector((s) => s.profile.username);
  const level = useAppSelector((s) => s.xp.level);
  const xp = useAppSelector((s) => s.xp.xpTotal);
  const streak = useAppSelector((s) => s.streak.streakCurrent);
  const streakDays = useAppSelector((s) => s.streak.streakDays);
  const studySecondsToday = useAppSelector((s) => s.session.studySecondsToday);
  const commitment = useAppSelector((s) => s.profile.commitment);
  useEffect(() => {
    logNav("screen:enter", { screen: "HomeScreen" });
    return () => logNav("screen:leave", { screen: "HomeScreen" });
  }, []);
  const nextLevelXp = level * 250;
  const currentLevelProgress = useMemo(() => {
    const lf = (level - 1) * 250;
    return Math.min(100, ((xp - lf) / 250) * 100);
  }, [level, xp]);
  const practiceMinutesToday = Math.floor(studySecondsToday / 60);
  const dailyGoalMinutes = Number(commitment);
  const dailyGoalProgressPct = dailyGoalMinutes > 0 ? Math.min(100, (practiceMinutesToday / dailyGoalMinutes) * 100) : 0;
  return {
    username,
    level,
    xp,
    streak,
    streakDays,
    nextLevelXp,
    currentLevelProgress,
    practiceMinutesToday,
    dailyGoalMinutes,
    dailyGoalProgressPct,
  };
}
