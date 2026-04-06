import { useCallback, useEffect, useMemo, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/LearningService";

export function useExerciseSingleChoice(
  exercise: Exercise,
  variant: "mcq" | "tap_token",
  lessonSource: "personalized" | "curriculum",
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  useEffect(() => {
    setSelected(null);
    setHasChecked(false);
    setIsCorrect(null);
    setServerResult(null);
  }, [exercise.id]);
  const runLocalCheck = useCallback(() => {
    if (exercise.correctAnswer === undefined) return;
    setIsCorrect(selected === exercise.correctAnswer);
    setHasChecked(true);
  }, [exercise.correctAnswer, selected]);
  const canCheck = Boolean(selected && !hasChecked);
  const runCheck = useCallback(async () => {
    if (!selected) return;
    if (lessonSource === "personalized") {
      runLocalCheck();
      return;
    }
    if (!accessToken || !learning) return;
    const result = await learning.submitExercise(exercise.id, selected);
    setServerResult(result);
    setIsCorrect(result.isCorrect);
    setHasChecked(true);
  }, [accessToken, exercise.id, lessonSource, learning, runLocalCheck, selected]);
  const goNext = useCallback(() => {
    if (!selected) return;
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(selected, {
        source: "personalized",
        isCorrect: Boolean(isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(selected, { source: "curriculum", submitResult: serverResult });
  }, [exercise.xpReward, isCorrect, lessonSource, onLessonExerciseComplete, selected, serverResult]);
  const options = useMemo(() => {
    if (variant === "mcq") return exercise.options.map((o) => o.text);
    return exercise.options.length > 0 ? exercise.options.map((o) => o.text) : exercise.codeSnippet.split(" ");
  }, [exercise.codeSnippet, exercise.options, variant]);
  return { selected, setSelected, hasChecked, isCorrect, serverResult, canCheck, runCheck, goNext, options };
}
