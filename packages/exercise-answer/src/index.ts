export function normaliseExerciseAnswer(s: string): string {
  return s.trim().replace(/\s/g, "");
}
