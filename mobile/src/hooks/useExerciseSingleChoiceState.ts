import { useCallback, useEffect, useState } from "react";

export function useExerciseSingleChoiceState(exerciseId: string, localCorrectAnswer: string | undefined) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelected(null);
    setHasChecked(false);
    setIsCorrect(null);
  }, [exerciseId]);

  const runLocalCheck = useCallback(() => {
    if (localCorrectAnswer === undefined) return;
    setIsCorrect(selected === localCorrectAnswer);
    setHasChecked(true);
  }, [localCorrectAnswer, selected]);

  return {
    selected,
    setSelected,
    hasChecked,
    isCorrect,
    runLocalCheck,
    setHasChecked,
    setIsCorrect,
  };
}
