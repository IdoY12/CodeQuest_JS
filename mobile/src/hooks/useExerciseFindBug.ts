import { useCallback, useEffect, useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useService } from "@/hooks/useService";
import LearningService from "@/services/LearningService";

export function useExerciseFindBug(
  exercise: Exercise,
  lessonSource: "personalized" | "curriculum",
  accessToken: string | null,
  onLessonExerciseComplete: (a: string, c: LessonExerciseCompletionContext) => void,
) {
  const learning = useService(LearningService);
  const [selected, setSelected] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  useEffect(() => {
    setSelected(null);
    setAttemptsLeft(3);
    setHasChecked(false);
    setIsCorrect(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
    setServerResult(null);
  }, [exercise.id]);
  const runCheckPersonalized = useCallback(() => {
    const ca = exercise.correctAnswer ?? "";
    const nextOk = selected === ca;
    if (!nextOk) setAttemptsLeft((v) => v - 1);
    if (nextOk || attemptsLeft <= 1) {
      setIsCorrect(nextOk);
      setHasChecked(true);
    }
  }, [attemptsLeft, exercise.correctAnswer, selected]);
  const canCheck = lessonSource === "personalized" ? !!selected && !hasChecked : !!selected && !curriculumChecked;
  const runCheck = async () => {
    if (!selected) return;
    if (lessonSource === "personalized") {
      runCheckPersonalized();
      return;
    }
    if (!accessToken) return;
    const result = await learning.submitExercise(exercise.id, selected);
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };
  const goNext = () => {
    if (!selected) return;
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(selected, {
        source: "personalized",
        isCorrect: Boolean(isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(selected, { source: "curriculum", submitResult: serverResult });
  };
  const showResults = lessonSource === "personalized" ? hasChecked : curriculumChecked;
  const isCorrectNow = lessonSource === "personalized" ? isCorrect : curriculumCorrect;
  return {
    selected,
    setSelected,
    attemptsLeft,
    canCheck,
    runCheck,
    goNext,
    showResults,
    isCorrectNow,
    serverResult,
  };
}
