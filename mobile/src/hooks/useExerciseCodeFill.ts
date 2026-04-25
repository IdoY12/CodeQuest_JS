import { useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/auth-aware/LearningService";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";

export function useExerciseCodeFill(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [input, setInput] = useState("");
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setInput("");
    setServerResult(null);
    setCurriculumChecked(false);
    setIsAnswerCorrect(null);
  }, [exercise.id]);

  // Allow re-submitting until the correct answer is entered.
  const canCheck = input.trim().length > 0 && isAnswerCorrect !== true;

  const runCheck = async () => {
    const answer = input.trim();
    const localEvaluation = evaluateExerciseLocally(exercise, answer);
    setServerResult({ xpEarned: localEvaluation.xpEarned, explanation: localEvaluation.explanation });
    setIsAnswerCorrect(localEvaluation.isAnswerCorrect);
    setCurriculumChecked(true);
    if (accessToken && learning && localEvaluation.isAnswerCorrect) {
      const persisted = await learning.submitExercise(exercise.id, answer);
      setServerResult((prev) => ({
        xpEarned: persisted.xpEarned,
        explanation: persisted.explanation ?? prev?.explanation,
        streakCurrent: persisted.streakCurrent ?? prev?.streakCurrent,
      }));
    }
  };

  const goNext = () => {
    if (!serverResult || isAnswerCorrect !== true) return;
    onLessonExerciseComplete(input.trim(), { source: "curriculum", isAnswerCorrect: true, submitResult: serverResult });
  };

  return { input, setInput, canCheck, runCheck, goNext, showResults: curriculumChecked, isAnswerCorrect, serverResult };
}
