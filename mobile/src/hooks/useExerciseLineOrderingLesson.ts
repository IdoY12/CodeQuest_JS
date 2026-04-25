import { useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/auth-aware/LearningService";
import { useExerciseLineOrdering } from "./useLessonExerciseInteractions";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";

export function useExerciseLineOrderingLesson(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const d = useExerciseLineOrdering(exercise.id, exercise.codeSnippet);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setServerResult(null);
    setCurriculumChecked(false);
    setIsAnswerCorrect(null);
  }, [exercise.id]);

  // Allow re-checking after wrong attempts — user must hit Reset to rearrange first.
  const canCheck = d.orderedSelection.length === d.lineList.length && isAnswerCorrect !== true;

  const runCheck = async () => {
    const localEvaluation = evaluateExerciseLocally(exercise, d.normalizedAnswer);
    setServerResult({ xpEarned: localEvaluation.xpEarned, explanation: localEvaluation.explanation });
    setIsAnswerCorrect(localEvaluation.isAnswerCorrect);
    setCurriculumChecked(true);
    if (accessToken && learning && localEvaluation.isAnswerCorrect) {
      const persisted = await learning.submitExercise(exercise.id, d.normalizedAnswer);
      setServerResult((prev) => ({
        xpEarned: persisted.xpEarned,
        explanation: persisted.explanation ?? prev?.explanation,
        streakCurrent: persisted.streakCurrent ?? prev?.streakCurrent,
      }));
    }
  };

  const goNext = () => {
    if (!serverResult || isAnswerCorrect !== true) return;
    onLessonExerciseComplete(d.normalizedAnswer, { source: "curriculum", isAnswerCorrect: true, submitResult: serverResult });
  };

  return { drag: d, canCheck, runCheck, goNext, showResults: curriculumChecked, isAnswerCorrect, serverResult };
}
