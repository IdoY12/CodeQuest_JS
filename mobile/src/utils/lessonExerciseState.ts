import { normaliseExerciseAnswer } from "@project/exercise-answer";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import type Exercise from "@/models/Exercise";
import { lineBugPickHeuristic } from "@/utils/formatHelpers";

/** How to render an `MCQ` row when the API only exposes `MCQ` | `PUZZLE`. */
export type McqSubkind = "concept" | "bugLine" | "lineOrder" | "mcqTap";

export function mcqSubkind(exercise: Exercise): McqSubkind {
  if (exercise.options.length === 0) return "concept";
  if (exercise.correctAnswer.includes("||")) return "lineOrder";
  if (lineBugPickHeuristic(exercise.prompt, exercise.codeSnippet, exercise.correctAnswer)) return "bugLine";
  return "mcqTap";
}

export type LessonExerciseSetters = {
  setExercises: (e: Exercise[]) => void;
  setExerciseIndex: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setAttemptedCount: (n: number) => void;
};

export function evaluateExerciseLocally(
  exercise: Exercise,
  answer: string,
): { isAnswerCorrect: boolean; xpEarned: number; explanation?: string } {
  const isAnswerCorrect =
    normaliseExerciseAnswer(answer) === normaliseExerciseAnswer(exercise.correctAnswer);
  return {
    isAnswerCorrect,
    xpEarned: isAnswerCorrect ? XP_PER_CORRECT_EXERCISE : 0,
    explanation: exercise.explanation ?? undefined,
  };
}

export function applyLessonExercisePayload(s: LessonExerciseSetters, payload: Exercise[], initialExerciseIndex = 0): void {
  s.setExercises(payload);
  s.setExerciseIndex(Math.min(Math.max(initialExerciseIndex, 0), Math.max(payload.length - 1, 0)));
  s.setCorrectCount(0);
  s.setAttemptedCount(0);
}
