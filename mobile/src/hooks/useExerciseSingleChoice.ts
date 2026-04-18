import { useCallback, useEffect, useMemo, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/auth-aware/LearningService";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";

export function useExerciseSingleChoice(
  exercise: Exercise,
  variant: "mcq" | "tap_token",
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  // Tracks what was SUBMITTED on the last check — distinct from `selected` which updates on
  // every tap. Only lastCheckedAnswer drives red/green highlighting so tapping a new option
  // never accidentally shows it as wrong before it has been checked.
  const [lastCheckedAnswer, setLastCheckedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
    setHasChecked(false);
    setIsCorrect(null);
    setServerResult(null);
    setLastCheckedAnswer(null);
  }, [exercise.id]);

  // Allow re-checking until the user lands on the correct answer.
  const canCheck = Boolean(selected) && isCorrect !== true;

  const runCheck = useCallback(async () => {
    if (!selected) return;
    setLastCheckedAnswer(selected);
    const result =
      accessToken && learning
        ? await learning.submitExercise(exercise.id, selected)
        : evaluateExerciseLocally(exercise, selected);
    setServerResult(result);
    setIsCorrect(result.isCorrect);
    setHasChecked(true);
  }, [accessToken, exercise, learning, selected]);

  const goNext = useCallback(() => {
    if (!selected || !serverResult) return;
    onLessonExerciseComplete(selected, { source: "curriculum", submitResult: serverResult });
  }, [onLessonExerciseComplete, selected, serverResult]);

  const options = useMemo(() => {
    if (variant === "mcq") return exercise.options.map((o) => o.text);
    return exercise.options.length > 0 ? exercise.options.map((o) => o.text) : exercise.codeSnippet.split(" ");
  }, [exercise.codeSnippet, exercise.options, variant]);

  return { selected, setSelected, hasChecked, isCorrect, serverResult, lastCheckedAnswer, canCheck, runCheck, goNext, options };
}
