import { logError, logTasks } from "@/utils/logger";
import LearningService from "@/services/LearningService";
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

export async function openFirstLessonInChapter(
  navigation: LearnRoadmapNavigation,
  chapterId: string,
  jwt: string,
): Promise<void> {
  const learning = new LearningService(jwt);
  const lessons = await learning.getLessons(chapterId);
  if (lessons.length === 0) return;
  navigation.navigate("Lesson", { lessonId: lessons[0].id, lessonTitle: lessons[0].title });
}
