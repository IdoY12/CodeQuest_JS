import { useCallback, useEffect, useState } from "react";

export function useExerciseMcq(exerciseId: string, correctAnswer: string) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelected(null);
    setHasChecked(false);
    setIsCorrect(null);
  }, [exerciseId]);

  const runCheck = useCallback(() => {
    setIsCorrect(selected === correctAnswer);
    setHasChecked(true);
  }, [correctAnswer, selected]);

  return { selected, setSelected, hasChecked, isCorrect, runCheck };
}
