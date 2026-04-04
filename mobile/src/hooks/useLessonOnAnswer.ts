import { useCallback } from "react";
import { useAppDispatcher } from "@/redux/hooks";
import { addXp as addXpAction } from "@/redux/xp-slice";
import type Exercise from "@/models/Exercise";
import type { LessonScreenNavigation } from "../types/learnNavigation.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import type { LessonExerciseCompletionContext } from "../types/lessonExerciseCompletion.types";
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
  const addXp = useCallback((n: number) => dispatch(addXpAction(n)), [dispatch]);

  return useCallback(
    async (answer: string, completion: LessonExerciseCompletionContext) => {
      await orchestrateLessonAnswer({
        completion,
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
