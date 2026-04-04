import { useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useService } from "@/hooks/useService";
import LearningService from "@/services/LearningService";
import { useExerciseDragDrop } from "./useLessonExerciseInteractions";

export function useExerciseDragDropLesson(
  exercise: Exercise,
  lessonSource: "personalized" | "curriculum",
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useService(LearningService);
  const d = useExerciseDragDrop(exercise.id, exercise.codeSnippet);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  useEffect(() => {
    setServerResult(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
  }, [exercise.id]);
  const canP = d.orderedSelection.length === d.lineList.length && !d.hasChecked;
  const canC = d.orderedSelection.length === d.lineList.length && !curriculumChecked;
  const canCheck = lessonSource === "personalized" ? canP : canC;
  const runCheck = async () => {
    if (lessonSource === "personalized") {
      d.runCheck(exercise.correctAnswer ?? "");
      return;
    }
    if (!accessToken) return;
    const result = await learning.submitExercise(exercise.id, d.normalizedAnswer);
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };
  const goNext = () => {
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(d.normalizedAnswer, {
        source: "personalized",
        isCorrect: Boolean(d.isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(d.normalizedAnswer, { source: "curriculum", submitResult: serverResult });
  };
  const showResults = lessonSource === "personalized" ? d.hasChecked : curriculumChecked;
  const isCorrectNow = lessonSource === "personalized" ? d.isCorrect : curriculumCorrect;
  return { drag: d, canCheck, runCheck, goNext, showResults, isCorrectNow, serverResult };
}
