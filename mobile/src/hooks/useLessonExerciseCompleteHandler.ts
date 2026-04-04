import { useCallback } from "react";
import { useAppDispatcher } from "@/redux/hooks";
import { addXp as addXpAction } from "@/redux/xp-slice";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import type { PersonalizationLevel } from "@/data/personalizedExercisePool";
import type Exercise from "@/models/Exercise";
import type { LessonScreenNavigation } from "@/types/learnNavigation.types";
import { orchestrateLessonAnswer } from "@/utils/lessonAnswerOrchestrator";

type Load = {
  exercises: Exercise[];
  exerciseIndex: number;
  correctCount: number;
  attemptedCount: number;
  setAttemptedCount: (n: number | ((p: number) => number)) => void;
  setCorrectCount: (n: number | ((p: number) => number)) => void;
  setExerciseIndex: (n: number | ((p: number) => number)) => void;
};

export function useLessonExerciseCompleteHandler(
  navigation: LessonScreenNavigation,
  personalizedLevel: PersonalizationLevel | undefined,
  lessonTitle: string,
  load: Load,
) {
  const dispatch = useAppDispatcher();
  const addXp = useCallback((n: number) => dispatch(addXpAction(n)), [dispatch]);
  return useCallback(
    async (_answer: string, completion: LessonExerciseCompletionContext) => {
      await orchestrateLessonAnswer({
        completion,
        personalizedLevel,
        addXp,
        exercises: load.exercises,
        exerciseIndex: load.exerciseIndex,
        correctCount: load.correctCount,
        attemptedCount: load.attemptedCount,
        lessonTitle,
        navigation,
        setAttemptedCount: load.setAttemptedCount,
        setCorrectCount: load.setCorrectCount,
        setExerciseIndex: load.setExerciseIndex,
      });
    },
    [
      addXp,
      load.attemptedCount,
      load.correctCount,
      load.exerciseIndex,
      load.exercises,
      load.setAttemptedCount,
      load.setCorrectCount,
      load.setExerciseIndex,
      lessonTitle,
      navigation,
      personalizedLevel,
    ],
  );
}
