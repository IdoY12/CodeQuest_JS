import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { ApiExercise } from "../types/learn.types";
import type { LessonScreenNavigation } from "../types/learnNavigation.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import { orchestrateLessonAnswer } from "../utils/lessonAnswerOrchestrator";

export function useLessonOnAnswer(
  navigation: LessonScreenNavigation,
  exercises: ApiExercise[],
  exerciseIndex: number,
  correctCount: number,
  attemptedCount: number,
  setExerciseIndex: (n: number) => void,
  setCorrectCount: (n: number) => void,
  setAttemptedCount: (n: number) => void,
  lessonTitle: string,
  personalizedLevel: PersonalizationLevel | undefined,
) {
  const addXp = useAppStore((s) => s.addXp);
  const accessToken = useAppStore((s) => s.accessToken);

  return useCallback(
    async (isCorrect: boolean, xp: number, answer: string) => {
      await orchestrateLessonAnswer({
        isCorrect,
        xp,
        answer,
        accessToken,
        personalizedLevel,
        addXp,
        exercises,
        exerciseIndex,
        correctCount,
        attemptedCount,
        lessonTitle,
        navigation,
        setAttemptedCount,
        setCorrectCount,
        setExerciseIndex,
      });
    },
    [
      accessToken,
      addXp,
      attemptedCount,
      correctCount,
      exerciseIndex,
      exercises,
      lessonTitle,
      navigation,
      personalizedLevel,
      setAttemptedCount,
      setCorrectCount,
      setExerciseIndex,
    ],
  );
}
