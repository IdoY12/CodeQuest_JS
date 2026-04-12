import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";

export type LessonExerciseSetters = {
  setExercises: (e: Exercise[]) => void;
  setExerciseIndex: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setAttemptedCount: (n: number) => void;
};

function normalise(s: string): string {
  return s.trim().replace(/\s/g, "");
}

export function evaluateExerciseLocally(exercise: Exercise, answer: string): ExerciseSubmitResult {
  const isCorrect = normalise(answer) === normalise(exercise.correctAnswer ?? "");
  return {
    isCorrect,
    xpEarned: isCorrect ? exercise.xpReward : 0,
    correctAnswer: exercise.correctAnswer,
    explanation: exercise.explanation,
  };
}

export function applyLessonExercisePayload(s: LessonExerciseSetters, payload: Exercise[], initialExerciseIndex = 0): void {
  s.setExercises(payload);
  s.setExerciseIndex(Math.min(Math.max(initialExerciseIndex, 0), Math.max(payload.length - 1, 0)));
  s.setCorrectCount(0);
  s.setAttemptedCount(0);
}
