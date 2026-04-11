import { useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/LearningService";

export function useExerciseCodeFill(
  exercise: Exercise,
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [input, setInput] = useState("");
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  useEffect(() => {
    setInput("");
    setServerResult(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
  }, [exercise.id]);
  const canCheck = input.trim().length > 0 && !curriculumChecked;
  const runCheck = async () => {
    if (!accessToken || !learning) return;
    const result = await learning.submitExercise(exercise.id, input.trim());
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };
  const goNext = () => {
    if (!serverResult) return;
    onLessonExerciseComplete(input.trim(), { source: "curriculum", submitResult: serverResult });
  };
  return { input, setInput, canCheck, runCheck, goNext, showResults: curriculumChecked, isCorrectNow: curriculumCorrect, serverResult };
}
