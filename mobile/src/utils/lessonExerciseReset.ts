import type Exercise from "@/models/Exercise";

type Setters = {
  setExercises: (e: Exercise[]) => void;
  setExerciseIndex: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setAttemptedCount: (n: number) => void;
};

export function applyLessonExercisePayload(s: Setters, payload: Exercise[]): void {
  s.setExercises(payload);
  s.setExerciseIndex(0);
  s.setCorrectCount(0);
  s.setAttemptedCount(0);
}
