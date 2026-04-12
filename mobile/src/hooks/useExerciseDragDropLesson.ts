import { useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/LearningService";
import { useExerciseDragDrop } from "./useLessonExerciseInteractions";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";

export function useExerciseDragDropLesson(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const d = useExerciseDragDrop(exercise.id, exercise.codeSnippet);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  useEffect(() => {
    setServerResult(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
  }, [exercise.id]);
  const canCheck = d.orderedSelection.length === d.lineList.length && !curriculumChecked;
  const runCheck = async () => {
    const result =
      accessToken && learning
        ? await learning.submitExercise(exercise.id, d.normalizedAnswer)
        : evaluateExerciseLocally(exercise, d.normalizedAnswer);
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };
  const goNext = () => {
    if (!serverResult) return;
    onLessonExerciseComplete(d.normalizedAnswer, { source: "curriculum", submitResult: serverResult });
  };
  return { drag: d, canCheck, runCheck, goNext, showResults: curriculumChecked, isCorrectNow: curriculumCorrect, serverResult };
}
