import { useCallback, useEffect, useState } from "react";

export function useExerciseFindBug(exerciseId: string, correctAnswer: string) {
  const [selected, setSelected] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelected(null);
    setAttemptsLeft(3);
    setHasChecked(false);
    setIsCorrect(null);
  }, [exerciseId]);

  const runCheck = useCallback(() => {
    const nextOk = selected === correctAnswer;
    if (!nextOk) setAttemptsLeft((v) => v - 1);
    if (nextOk || attemptsLeft <= 1) {
      setIsCorrect(nextOk);
      setHasChecked(true);
    }
  }, [attemptsLeft, correctAnswer, selected]);

  return { selected, setSelected, attemptsLeft, hasChecked, isCorrect, runCheck };
}
