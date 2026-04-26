import { useCallback, useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/auth-aware/LearningService";
import { evaluateExerciseLocally, mcqSubkind } from "@/utils/lessonExerciseState";
import { persistLessonExerciseOnCorrect, useExerciseLineOrdering } from "@/hooks/useLessonExerciseInteractions";
const CONCEPT_SENTINEL = "concept-card";
export function useBuiltAnswerLessonExercise(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const sk = exercise.type === "PUZZLE" ? null : mcqSubkind(exercise);
  const isConcept = sk === "concept";
  const isLine = sk === "lineOrder";
  const lineOrder = useExerciseLineOrdering(exercise.id, exercise.codeSnippet, isLine);

  useEffect(() => {
    setInput("");
    setServerResult(null);
    setHasChecked(false);
    setIsAnswerCorrect(null);
  }, [exercise.id]);

  const canCheck = isConcept
    ? false
    : isLine
      ? lineOrder.orderedSelection.length === lineOrder.lineList.length && isAnswerCorrect !== true
      : input.trim().length > 0 && isAnswerCorrect !== true;

  const runCheck = useCallback(async () => {
    if (isConcept) return;
    const answer = isLine ? lineOrder.normalizedAnswer : input.trim();
    const ev = evaluateExerciseLocally(exercise, answer);
    setServerResult({ xpEarned: ev.xpEarned, explanation: ev.explanation });
    setIsAnswerCorrect(ev.isAnswerCorrect);
    setHasChecked(true);
    if (accessToken && learning && ev.isAnswerCorrect) {
      await persistLessonExerciseOnCorrect(learning, exercise.id, answer, setServerResult);
    }
  }, [accessToken, exercise, input, isConcept, isLine, learning, lineOrder.lineList.length, lineOrder.normalizedAnswer, lineOrder.orderedSelection.length]);

  const goNext = useCallback(() => {
    if (isConcept) return;
    const answer = isLine ? lineOrder.normalizedAnswer : input.trim();
    if (!serverResult || isAnswerCorrect !== true) return;
    onLessonExerciseComplete(answer, { source: "curriculum", isAnswerCorrect: true, submitResult: serverResult });
  }, [isAnswerCorrect, isConcept, isLine, input, lineOrder.normalizedAnswer, onLessonExerciseComplete, serverResult]);

  const submitConcept = useCallback(async () => {
    if (!isConcept) return;
    setBusy(true);
    try {
      const ev = evaluateExerciseLocally(exercise, CONCEPT_SENTINEL);
      let submitResult: ExerciseSubmitResult = { xpEarned: ev.xpEarned, explanation: ev.explanation };
      if (accessToken && learning && ev.isAnswerCorrect) {
        const persisted = await learning.submitExercise(exercise.id, CONCEPT_SENTINEL);
        submitResult = {
          xpEarned: persisted.xpEarned,
          explanation: persisted.explanation ?? submitResult.explanation,
          streakCurrent: persisted.streakCurrent,
        };
      }
      onLessonExerciseComplete(CONCEPT_SENTINEL, { source: "curriculum", isAnswerCorrect: ev.isAnswerCorrect, submitResult });
    } finally {
      setBusy(false);
    }
  }, [accessToken, exercise, isConcept, learning, onLessonExerciseComplete]);

  return { input, setInput, lineOrder, busy, submitConcept, hasChecked, isAnswerCorrect, serverResult, canCheck, runCheck, goNext };
}
