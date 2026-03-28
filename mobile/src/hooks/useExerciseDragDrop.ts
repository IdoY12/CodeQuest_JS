import { useCallback, useEffect, useMemo, useState } from "react";
import { shuffleLines } from "../utils/shuffleLines";

export function useExerciseDragDrop(exerciseId: string, codeSnippet: string) {
  const lineList = useMemo(() => codeSnippet.split("\n"), [codeSnippet]);
  const [orderedSelection, setOrderedSelection] = useState<string[]>([]);
  const [poolLines, setPoolLines] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setOrderedSelection([]);
    setPoolLines(shuffleLines(lineList));
    setHasChecked(false);
    setIsCorrect(null);
  }, [exerciseId, lineList]);

  const addLine = useCallback((line: string, poolIdx: number) => {
    setOrderedSelection((c) => [...c, line]);
    setPoolLines((c) => c.filter((_, i) => i !== poolIdx));
  }, []);

  const removeLine = useCallback((idx: number, line: string) => {
    setOrderedSelection((c) => c.filter((_, i) => i !== idx));
    setPoolLines((c) => [...c, line]);
  }, []);

  const resetOrder = useCallback(() => {
    setPoolLines(shuffleLines(lineList));
    setOrderedSelection([]);
    setHasChecked(false);
    setIsCorrect(null);
  }, [lineList]);

  const normalizedAnswer = orderedSelection.join("||");

  const runCheck = useCallback(
    (correctAnswer: string) => {
      setIsCorrect(normalizedAnswer === correctAnswer);
      setHasChecked(true);
    },
    [normalizedAnswer],
  );

  return {
    lineList,
    orderedSelection,
    poolLines,
    hasChecked,
    isCorrect,
    normalizedAnswer,
    addLine,
    removeLine,
    resetOrder,
    runCheck,
  };
}
