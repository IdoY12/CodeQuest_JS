import type { ApiExercise } from "../types/learn.types";

type Setters = {
  setExercises: (e: ApiExercise[]) => void;
  setExerciseIndex: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setAttemptedCount: (n: number) => void;
};

export function applyLessonExercisePayload(s: Setters, payload: ApiExercise[]): void {
  s.setExercises(payload);
  s.setExerciseIndex(0);
  s.setCorrectCount(0);
  s.setAttemptedCount(0);
}
