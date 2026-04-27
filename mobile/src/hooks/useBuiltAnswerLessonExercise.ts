import { useCallback, useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/auth-aware/LearningService";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";
import { persistLessonExerciseOnCorrect } from "@/hooks/useLessonExerciseInteractions";

export function useBuiltAnswerLessonExercise(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (answer: string, completionContext: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [input, setInput] = useState("");
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setInput("");
    setServerResult(null);
    setHasChecked(false);
    setIsAnswerCorrect(null);
  }, [exercise.id]);

  const canCheck = input.trim().length > 0 && isAnswerCorrect !== true;

  const runCheck = useCallback(async () => {
    const answer = input.trim();
    const ev = evaluateExerciseLocally(exercise, answer);
    setServerResult({ xpEarned: ev.xpEarned, explanation: ev.explanation });
    setIsAnswerCorrect(ev.isAnswerCorrect);
    setHasChecked(true);
    if (accessToken && learning && ev.isAnswerCorrect) {
      await persistLessonExerciseOnCorrect(learning, exercise.id, answer, setServerResult);
    }
  }, [accessToken, exercise, input, learning]);

  const goNext = useCallback(() => {
    const answer = input.trim();
    if (!serverResult || isAnswerCorrect !== true) return;
    onLessonExerciseComplete(answer, { source: "curriculum", isAnswerCorrect: true, submitResult: serverResult });
  }, [input, isAnswerCorrect, onLessonExerciseComplete, serverResult]);

  return { input, setInput, hasChecked, isAnswerCorrect, serverResult, canCheck, runCheck, goNext };
}
