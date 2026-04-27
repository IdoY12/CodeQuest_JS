import type { Dispatch, SetStateAction } from "react";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import LearningService from "@/services/auth-aware/LearningService";

export async function persistLessonExerciseOnCorrect(
  learning: LearningService,
  exerciseId: string,
  answer: string,
  setServerResult: Dispatch<SetStateAction<ExerciseSubmitResult | null>>,
): Promise<void> {
  const persisted = await learning.submitExercise(exerciseId, answer);
  setServerResult((prev) => ({
    xpEarned: persisted.xpEarned,
    explanation: persisted.explanation ?? prev?.explanation,
    streakCurrent: persisted.streakCurrent,
  }));
}
