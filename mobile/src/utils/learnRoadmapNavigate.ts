import { apiRequest } from "../services/api";
import type Lesson from "@/models/Lesson";
import type { LearnRoadmapNavigation } from "../types/learnNavigation.types";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";

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

export async function navigateToChapterLesson(
  navigation: LearnRoadmapNavigation,
  chapterId: string,
  accessToken: string | null,
): Promise<void> {
  if (!accessToken) return;
  const lessons = await apiRequest<Lesson[]>(`/learning/lessons/${chapterId}`, { token: accessToken });
  if (lessons.length === 0) return;
  navigation.navigate("Lesson", { lessonId: lessons[0].id, lessonTitle: lessons[0].title });
}
