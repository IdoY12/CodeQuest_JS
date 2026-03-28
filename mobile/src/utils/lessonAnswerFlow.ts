import * as Haptics from "expo-haptics";
import { apiRequest } from "../services/api";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LessonScreenNavigation } from "../types/learnNavigation.types";

type AddXp = (n: number) => void;

export async function grantServerXp(
  token: string,
  exercise: Exercise,
  answer: string,
  addXp: AddXp,
  fallbackXp: number,
): Promise<void> {
  try {
    const result = await apiRequest<ExerciseSubmitResult>("/learning/submit-exercise", {
      method: "POST",
      token,
      body: JSON.stringify({
        exerciseId: exercise.id,
        answer,
        timeTakenMs: 1000,
        attempts: 1,
      }),
    });
    addXp(result.xpEarned);
  } catch {
    addXp(fallbackXp);
  }
}

export function grantLocalXp(addXp: AddXp, xp: number): void {
  addXp(xp);
}

export function hapticForCorrect(isCorrect: boolean): void {
  const type = isCorrect
    ? Haptics.NotificationFeedbackType.Success
    : Haptics.NotificationFeedbackType.Error;
  void Haptics.notificationAsync(type);
}

export function finishOrAdvance(
  nextIndex: number,
  total: number,
  accuracy: number,
  lessonTitle: string,
  navigation: LessonScreenNavigation,
  setIndex: (n: number) => void,
): void {
  if (nextIndex >= total) {
    navigation.replace("LessonResults", { accuracy, lessonTitle });
    return;
  }
  setIndex(nextIndex);
}
