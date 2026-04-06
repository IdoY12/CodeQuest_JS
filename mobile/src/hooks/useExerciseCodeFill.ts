import { useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/LearningService";

export function useExerciseCodeFill(
  exercise: Exercise,
  lessonSource: "personalized" | "curriculum",
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useAuthenticatedService(LearningService);
  const [input, setInput] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  useEffect(() => {
    setInput("");
    setHasChecked(false);
    setIsCorrect(null);
    setServerResult(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
  }, [exercise.id]);
  const canCheckP = input.trim().length > 0 && !hasChecked;
  const canCheckC = input.trim().length > 0 && !curriculumChecked;
  const canCheck = lessonSource === "personalized" ? canCheckP : canCheckC;
  const runCheck = async () => {
    if (lessonSource === "personalized") {
      const ok = input.replace(/\s/g, "") === (exercise.correctAnswer ?? "").replace(/\s/g, "");
      setIsCorrect(ok);
      setHasChecked(true);
      return;
    }
    if (!accessToken || !learning) return;
    const result = await learning.submitExercise(exercise.id, input.trim());
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };
  const goNext = () => {
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(input, {
        source: "personalized",
        isCorrect: Boolean(isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(input.trim(), { source: "curriculum", submitResult: serverResult });
  };
  const showResults = lessonSource === "personalized" ? hasChecked : curriculumChecked;
  const isCorrectNow = lessonSource === "personalized" ? isCorrect : curriculumCorrect;
  return { input, setInput, canCheck, runCheck, goNext, showResults, isCorrectNow, serverResult };
}
