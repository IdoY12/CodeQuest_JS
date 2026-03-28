import { useCallback, useEffect, useState } from "react";

export function useExerciseCodeFill(exerciseId: string, correctAnswer: string) {
  const [input, setInput] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setInput("");
    setHasChecked(false);
    setIsCorrect(null);
  }, [exerciseId]);

  const runCheck = useCallback(() => {
    const ok = input.replace(/\s/g, "") === correctAnswer.replace(/\s/g, "");
    setIsCorrect(ok);
    setHasChecked(true);
  }, [correctAnswer, input]);

  return { input, setInput, hasChecked, isCorrect, runCheck };
}
