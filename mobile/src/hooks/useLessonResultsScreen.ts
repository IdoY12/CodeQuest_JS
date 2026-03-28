import { useEffect } from "react";
import { logNav } from "../services/logger";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { incrementLessonsCompleted } from "@/redux/duel-slice";

export function useLessonResultsScreen() {
  const dispatch = useAppDispatcher();
  const level = useAppSelector((s) => s.xp.level);
  const xp = useAppSelector((s) => s.xp.xpTotal);

  useEffect(() => {
    logNav("screen:enter", { screen: "LessonResultsScreen" });
    dispatch(incrementLessonsCompleted());
    return () => logNav("screen:leave", { screen: "LessonResultsScreen" });
  }, [dispatch]);

  return { level, xp };
}
