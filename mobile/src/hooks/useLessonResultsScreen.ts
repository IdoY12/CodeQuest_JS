import { useEffect } from "react";
import { logNav } from "../services/logger";
import { useAppStore } from "@/store/useAppStore";

export function useLessonResultsScreen() {
  const level = useAppStore((s) => s.level);
  const xp = useAppStore((s) => s.xpTotal);
  const incrementLessonsCompleted = useAppStore((s) => s.incrementLessonsCompleted);

  useEffect(() => {
    logNav("screen:enter", { screen: "LessonResultsScreen" });
    incrementLessonsCompleted();
    return () => logNav("screen:leave", { screen: "LessonResultsScreen" });
  }, [incrementLessonsCompleted]);

  return { level, xp };
}
