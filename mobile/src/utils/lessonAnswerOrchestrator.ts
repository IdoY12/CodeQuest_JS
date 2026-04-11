import * as Haptics from "expo-haptics";
import type { LessonScreenNavigation } from "@/types/learnNavigation.types";
import type { Experience } from "@/redux/profile-slice";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";

type AddXp = (n: number) => void;

export type LessonAnswerOrchestratorArgs = {
  completion: LessonExerciseCompletionContext;
  addXp: AddXp;
  exercisesLength: number;
  exerciseIndex: number;
  correctCount: number;
  attemptedCount: number;
  lessonTitle: string;
  experienceLevel: Experience;
  navigation: LessonScreenNavigation;
  setAttemptedCount: (n: number) => void;
  setCorrectCount: (n: number) => void;
  setExerciseIndex: (n: number) => void;
};

function grantXp(addXp: AddXp, xp: number): void {
  addXp(xp);
}

function hapticForCorrect(isCorrect: boolean): void {
  void Haptics.notificationAsync(
    isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
  );
}

function finishOrAdvance(
  nextIndex: number,
  total: number,
  accuracy: number,
  lessonTitle: string,
  experienceLevel: Experience,
  navigation: LessonScreenNavigation,
  setIndex: (n: number) => void,
): void {
  if (nextIndex >= total) {
    navigation.replace("LessonResults", { accuracy, lessonTitle, experienceLevel });
    return;
  }
  setIndex(nextIndex);
}

export async function orchestrateLessonAnswer(a: LessonAnswerOrchestratorArgs): Promise<void> {
  const { isCorrect, xpEarned } = a.completion.submitResult;
  const nextAttempted = a.attemptedCount + 1;
  const nextCorrect = isCorrect ? a.correctCount + 1 : a.correctCount;
  a.setAttemptedCount(nextAttempted);
  if (isCorrect) a.setCorrectCount(nextCorrect);
  if (isCorrect) grantXp(a.addXp, xpEarned);
  hapticForCorrect(isCorrect);
  const accuracy = Math.round((nextCorrect / nextAttempted) * 100);
  finishOrAdvance(
    a.exerciseIndex + 1,
    a.exercisesLength,
    accuracy,
    a.lessonTitle,
    a.experienceLevel,
    a.navigation,
    a.setExerciseIndex,
  );
}
