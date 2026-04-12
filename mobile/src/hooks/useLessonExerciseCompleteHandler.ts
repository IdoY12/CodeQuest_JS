import { useCallback } from "react";
import { useAppDispatcher } from "@/redux/hooks";
import { resetBlockProgress, setExerciseIndex as setSavedExerciseIndex } from "@/redux/lesson-slice";
import { addXp as addXpAction } from "@/redux/xp-slice";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import type { Experience } from "@/redux/profile-slice";
import type { LessonScreenNavigation } from "@/types/learnNavigation.types";
import { orchestrateLessonAnswer } from "@/utils/lessonAnswerOrchestrator";

type Load = {
  exercises: { length: number };
  exerciseIndex: number;
  correctCount: number;
  attemptedCount: number;
  setAttemptedCount: (n: number | ((p: number) => number)) => void;
  setCorrectCount: (n: number | ((p: number) => number)) => void;
  setExerciseIndex: (n: number | ((p: number) => number)) => void;
};

export function useLessonExerciseCompleteHandler(
  navigation: LessonScreenNavigation,
  experienceLevel: Experience,
  lessonTitle: string,
  blockIndex: number,
  load: Load,
) {
  const dispatch = useAppDispatcher();
  const addXp = useCallback((n: number) => dispatch(addXpAction(n)), [dispatch]);
  return useCallback(
    async (_answer: string, completion: LessonExerciseCompletionContext) => {
      await orchestrateLessonAnswer({
        completion,
        addXp,
        exercisesLength: load.exercises.length,
        exerciseIndex: load.exerciseIndex,
        correctCount: load.correctCount,
        attemptedCount: load.attemptedCount,
        lessonTitle,
        experienceLevel,
        navigation,
        setAttemptedCount: load.setAttemptedCount,
        setCorrectCount: load.setCorrectCount,
        setExerciseIndex: load.setExerciseIndex,
      });
      if (load.exerciseIndex + 1 >= load.exercises.length) {
        dispatch(setSavedExerciseIndex(0));
        dispatch(resetBlockProgress({ level: experienceLevel, blockIndex }));
      }
    },
    [
      addXp,
      blockIndex,
      load.attemptedCount,
      load.correctCount,
      load.exerciseIndex,
      load.exercises.length,
      load.setAttemptedCount,
      load.setCorrectCount,
      load.setExerciseIndex,
      lessonTitle,
      navigation,
      experienceLevel,
      dispatch,
    ],
  );
}
