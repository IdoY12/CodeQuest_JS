import { useCallback, useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/LearningService";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";

export function useExerciseFindBug(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [selected, setSelected] = useState<string | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  useEffect(() => {
    setSelected(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
    setServerResult(null);
  }, [exercise.id]);
  const canCheck = Boolean(selected && !curriculumChecked);
  const runCheck = useCallback(async () => {
    if (!selected) return;
    const result =
      accessToken && learning
        ? await learning.submitExercise(exercise.id, selected)
        : evaluateExerciseLocally(exercise, selected);
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  }, [accessToken, exercise, learning, selected]);
  const goNext = () => {
    if (!selected || !serverResult) return;
    onLessonExerciseComplete(selected, { source: "curriculum", submitResult: serverResult });
  };
  return {
    selected,
    setSelected,
    canCheck,
    runCheck,
    goNext,
    showResults: curriculumChecked,
    isCorrectNow: curriculumCorrect,
    serverResult,
  };
}
