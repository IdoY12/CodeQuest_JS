import type Exercise from "@/models/Exercise";

export type LessonExerciseSetters = {
  setExercises: (e: Exercise[]) => void;
  setExerciseIndex: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setAttemptedCount: (n: number) => void;
};

export function applyLessonExercisePayload(s: LessonExerciseSetters, payload: Exercise[]) {
  s.setExercises(payload);
  s.setExerciseIndex(0);
  s.setCorrectCount(0);
  s.setAttemptedCount(0);
}
