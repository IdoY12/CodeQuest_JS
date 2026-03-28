import type Exercise from "@/models/Exercise";
import type { LessonScreenNavigation } from "../types/learnNavigation.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";
import { finishOrAdvance, grantLocalXp, grantServerXp, hapticForCorrect } from "./lessonAnswerFlow";

type AddXp = (n: number) => void;

export type LessonAnswerOrchestratorArgs = {
  isCorrect: boolean;
  xp: number;
  answer: string;
  accessToken: string | null;
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

export async function orchestrateLessonAnswer(a: LessonAnswerOrchestratorArgs): Promise<void> {
  const nextA = a.attemptedCount + 1;
  const nextC = a.isCorrect ? a.correctCount + 1 : a.correctCount;
  a.setAttemptedCount(nextA);
  if (a.isCorrect) a.setCorrectCount(nextC);
  await applyXpReward(a);
  hapticForCorrect(a.isCorrect);
  const acc = Math.round((nextC / nextA) * 100);
  finishOrAdvance(a.exerciseIndex + 1, a.exercises.length, acc, a.lessonTitle, a.navigation, a.setExerciseIndex);
}

async function applyXpReward(a: LessonAnswerOrchestratorArgs): Promise<void> {
  if (!a.isCorrect) return;
  const ex = a.exercises[a.exerciseIndex];
  if (a.accessToken && !a.personalizedLevel) {
    await grantServerXp(a.accessToken, ex, a.answer, a.addXp, a.xp);
    return;
  }
  grantLocalXp(a.addXp, a.xp);
}
