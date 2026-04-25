import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";

export type LessonExerciseCompletionContext = {
  source: "curriculum";
  isAnswerCorrect: boolean;
  submitResult: ExerciseSubmitResult;
};
