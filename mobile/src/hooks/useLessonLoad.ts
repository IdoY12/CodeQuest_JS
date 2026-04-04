import { useEffect, useState } from "react";
import { logError, logNav, logTasks } from "../services/logger";
import { apiRequest } from "../services/api";
import type Exercise from "@/models/Exercise";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import { applyLessonExercisePayload } from "../utils/lessonExerciseReset";

export function useLessonLoad(
  lessonId: string,
  personalizedLevel: PersonalizationLevel | undefined,
  accessToken: string | null,
) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  useEffect(() => {
    logNav("screen:enter", { screen: "LessonScreen", lessonId });
    return () => logNav("screen:leave", { screen: "LessonScreen", lessonId });
  }, [lessonId]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      try {
        if (personalizedLevel) {
          const { getExercisePoolForLevel } = await import("../data/personalizedExercisePool");
          const payload = getExercisePoolForLevel(personalizedLevel);
          logTasks("lesson:loaded-personalized", { level: personalizedLevel, count: payload.length });
          if (active) {
            applyLessonExercisePayload(
              { setExercises, setExerciseIndex, setCorrectCount, setAttemptedCount },
              payload,
            );
          }
          return;
        }
        if (!accessToken) {
          logTasks("lesson:skip-api-no-token", { lessonId });
          return;
        }
        const payload = await apiRequest<Exercise[]>(`/learning/exercises/${lessonId}`, { token: accessToken });
        logTasks("lesson:loaded-api", { lessonId, count: payload.length });
        if (active) {
          applyLessonExercisePayload(
            { setExercises, setExerciseIndex, setCorrectCount, setAttemptedCount },
            payload,
          );
        }
      } catch (error) {
        logError("[TASKS]", error, { phase: "load-exercises", lessonId });
      } finally {
        if (active) setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [lessonId, personalizedLevel, accessToken]);

  return {
    exercises,
    loading,
    exerciseIndex,
    setExerciseIndex,
    correctCount,
    setCorrectCount,
    attemptedCount,
    setAttemptedCount,
  };
}
