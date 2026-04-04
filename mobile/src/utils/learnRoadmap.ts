import { logError, logTasks } from "@/services/logger";
import type { LearnRoadmapNavigation } from "@/types/learnNavigation.types";
import type { PersonalizationLevel } from "@/data/personalizedExercisePool";

type PathKey = string;

export function logChaptersSkipNoToken(path: PathKey): void {
  logTasks("chapters:skip-no-token", { path });
}

export function logChaptersLoaded(path: PathKey, count: number): void {
  logTasks("chapters:loaded", { path, count });
}

export function logChaptersError(path: PathKey, error: unknown): void {
  logError("[TASKS]", error, { phase: "load-chapters", path });
}

export function navigateToPersonalizedLesson(
  navigation: LearnRoadmapNavigation,
  experience: PersonalizationLevel,
): void {
  navigation.navigate("Lesson", {
    lessonId: `personalized-${experience}`,
    lessonTitle: `${experience} Personalized Practice`,
    personalizedLevel: experience,
  });
}
