import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";

export type LessonExerciseCompletionContext =
  | { source: "personalized"; isCorrect: boolean; xpReward: number }
  | { source: "curriculum"; submitResult: ExerciseSubmitResult };
