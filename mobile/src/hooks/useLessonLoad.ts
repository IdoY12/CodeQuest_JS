import { useEffect, useState } from "react";
import { logError, logNav, logTasks } from "../services/logger";
import { apiRequest } from "../services/api";
import { getExercisePoolForLevel } from "../data/personalizedExercisePool";
import type { ApiExercise } from "../types/learn.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import { applyLessonExercisePayload } from "../utils/lessonExerciseReset";

export function useLessonLoad(lessonId: string, personalizedLevel: PersonalizationLevel | undefined) {
  const [exercises, setExercises] = useState<ApiExercise[]>([]);
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
        const payload = await apiRequest<ApiExercise[]>(`/learning/exercises/${lessonId}`);
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
  }, [lessonId, personalizedLevel]);

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
