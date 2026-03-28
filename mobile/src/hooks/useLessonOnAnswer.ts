import { useCallback } from "react";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { addXp as addXpAction } from "@/redux/xp-slice";
import type Exercise from "@/models/Exercise";
import type { LessonScreenNavigation } from "../types/learnNavigation.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import { orchestrateLessonAnswer } from "../utils/lessonAnswerOrchestrator";

export function useLessonOnAnswer(
  navigation: LessonScreenNavigation,
  exercises: Exercise[],
  exerciseIndex: number,
  correctCount: number,
  attemptedCount: number,
  setExerciseIndex: (n: number) => void,
  setCorrectCount: (n: number) => void,
  setAttemptedCount: (n: number) => void,
  lessonTitle: string,
  personalizedLevel: PersonalizationLevel | undefined,
) {
  const dispatch = useAppDispatcher();
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const addXp = useCallback((n: number) => dispatch(addXpAction(n)), [dispatch]);

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
