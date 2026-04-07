import type Exercise from "@/models/Exercise";

export type LessonExerciseSetters = {
  setExercises: (e: Exercise[]) => void;
  setExerciseIndex: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setAttemptedCount: (n: number) => void;
};

export function applyLessonExercisePayload(s: LessonExerciseSetters, payload: Exercise[], initialExerciseIndex = 0): void {
  s.setExercises(payload);
  s.setExerciseIndex(Math.min(Math.max(initialExerciseIndex, 0), Math.max(payload.length - 1, 0)));
  s.setCorrectCount(0);
  s.setAttemptedCount(0);
}
