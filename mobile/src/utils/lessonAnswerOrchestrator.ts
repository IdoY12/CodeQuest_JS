import type Exercise from "@/models/Exercise";
import type { LessonScreenNavigation } from "../types/learnNavigation.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import { finishOrAdvance, grantLocalXp, hapticForCorrect } from "./lessonAnswerFlow";
import type { LessonExerciseCompletionContext } from "../types/lessonExerciseCompletion.types";

type AddXp = (n: number) => void;

export type LessonAnswerOrchestratorArgs = {
  completion: LessonExerciseCompletionContext;
  personalizedLevel: PersonalizationLevel | undefined;
  addXp: AddXp;
  exercises: Exercise[];
  exerciseIndex: number;
  correctCount: number;
  attemptedCount: number;
  lessonTitle: string;
  navigation: LessonScreenNavigation;
  setAttemptedCount: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setExerciseIndex: (n: number) => void;
};

function resolveOutcome(completion: LessonExerciseCompletionContext): { isCorrect: boolean; xp: number } {
  if (completion.source === "personalized") {
    return { isCorrect: completion.isCorrect, xp: completion.xpReward };
  }
  return { isCorrect: completion.submitResult.isCorrect, xp: completion.submitResult.xpEarned };
}

export async function orchestrateLessonAnswer(a: LessonAnswerOrchestratorArgs): Promise<void> {
  const { isCorrect, xp } = resolveOutcome(a.completion);
  const nextAttempted = a.attemptedCount + 1;
  const nextCorrect = isCorrect ? a.correctCount + 1 : a.correctCount;
  a.setAttemptedCount(nextAttempted);
  if (isCorrect) a.setCorrectCount(nextCorrect);
  await applyXpReward(a, isCorrect, xp);
  hapticForCorrect(isCorrect);
  const accuracy = Math.round((nextCorrect / nextAttempted) * 100);
  finishOrAdvance(a.exerciseIndex + 1, a.exercises.length, accuracy, a.lessonTitle, a.navigation, a.setExerciseIndex);
}

async function applyXpReward(
  a: LessonAnswerOrchestratorArgs,
  isCorrect: boolean,
  xp: number,
): Promise<void> {
  if (!isCorrect) return;
  if (a.personalizedLevel) {
    grantLocalXp(a.addXp, xp);
    return;
  }
  a.addXp(xp);
}
