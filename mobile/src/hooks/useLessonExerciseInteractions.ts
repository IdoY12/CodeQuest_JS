import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { shuffleLines } from "@/utils/formatHelpers";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import LearningService from "@/services/auth-aware/LearningService";

export async function persistLessonExerciseOnCorrect(
  learning: LearningService,
  exerciseId: string,
  answer: string,
  setServerResult: Dispatch<SetStateAction<ExerciseSubmitResult | null>>,
): Promise<void> {
  const persisted = await learning.submitExercise(exerciseId, answer);
  setServerResult((prev) => ({
    xpEarned: persisted.xpEarned,
    explanation: persisted.explanation ?? prev?.explanation,
    streakCurrent: persisted.streakCurrent,
  }));
}

export function useExerciseLineOrdering(exerciseId: string, codeSnippet: string, active: boolean) {
  const lineList = useMemo(() => (active ? codeSnippet.split("\n") : []), [active, codeSnippet]);
  const [orderedSelection, setOrderedSelection] = useState<string[]>([]);
  const [poolLines, setPoolLines] = useState<string[]>([]);

  useEffect(() => {
    setOrderedSelection([]);
    if (!active) {
      setPoolLines([]);
      return;
    }
    setPoolLines(shuffleLines(lineList));
  }, [active, exerciseId, lineList]);

  const addLine = useCallback(
    (line: string, poolIdx: number) => {
      if (!active) return;
      setOrderedSelection((c) => [...c, line]);
      setPoolLines((c) => c.filter((_, i) => i !== poolIdx));
    },
    [active],
  );

  const removeLine = useCallback(
    (idx: number, line: string) => {
      if (!active) return;
      setOrderedSelection((c) => c.filter((_, i) => i !== idx));
      setPoolLines((c) => [...c, line]);
    },
    [active],
  );

  const resetOrder = useCallback(() => {
    if (!active) return;
    setPoolLines(shuffleLines(lineList));
    setOrderedSelection([]);
  }, [active, lineList]);

  const normalizedAnswer = active ? orderedSelection.join("||") : "";

  return { lineList, orderedSelection, poolLines, normalizedAnswer, addLine, removeLine, resetOrder };
}
