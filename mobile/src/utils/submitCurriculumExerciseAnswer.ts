import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { apiRequest } from "@/services/api";

export async function submitCurriculumExerciseAnswer(
  accessToken: string,
  exercise: Exercise,
  answer: string,
): Promise<ExerciseSubmitResult> {
  return apiRequest<ExerciseSubmitResult>("/learning/submit-exercise", {
    method: "POST",
    token: accessToken,
    body: JSON.stringify({
      exerciseId: exercise.id,
      answer,
      timeTakenMs: 1000,
      attempts: 1,
    }),
  });
}
