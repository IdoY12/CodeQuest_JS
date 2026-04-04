import { AuthAware } from "@/services/AuthAware";
import { applyLessonExercisePayload, type LessonExerciseSetters } from "@/services/lessonExerciseState";
import { logError, logTasks } from "@/services/logger";
import type Chapter from "@/models/Chapter";
import type Exercise from "@/models/Exercise";
import type Lesson from "@/models/Lesson";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import type { LearnRoadmapNavigation } from "@/types/learnNavigation.types";
import type { PersonalizationLevel } from "@/data/personalizedExercisePool";

export type { LessonExerciseSetters } from "@/services/lessonExerciseState";

export default class LearningService extends AuthAware {
  fetchChapters(path: string) {
    return this.getJson<Chapter[]>(`/learning/chapters/${path}`);
  }
  fetchLessons(chapterId: string) {
    return this.getJson<Lesson[]>(`/learning/lessons/${chapterId}`);
  }
  fetchExercises(lessonId: string) {
    return this.getJson<Exercise[]>(`/learning/exercises/${lessonId}`);
  }
  submitExercise(exerciseId: string, answer: string) {
    return this.postJson<ExerciseSubmitResult>("/learning/submit-exercise", {
      exerciseId,
      answer,
      timeTakenMs: 1000,
      attempts: 1,
    });
  }
  async openFirstLesson(navigation: LearnRoadmapNavigation, chapterId: string): Promise<void> {
    if (!this.hasToken()) return;
    const lessons = await this.fetchLessons(chapterId);
    if (lessons.length === 0) return;
    navigation.navigate("Lesson", { lessonId: lessons[0].id, lessonTitle: lessons[0].title });
  }
  async loadExercisesIntoState(
    lessonId: string,
    pl: PersonalizationLevel | undefined,
    active: () => boolean,
    set: LessonExerciseSetters,
  ): Promise<void> {
    try {
      if (pl) {
        const { getExercisePoolForLevel } = await import("@/data/personalizedExercisePool");
        const payload = getExercisePoolForLevel(pl);
        logTasks("lesson:loaded-personalized", { level: pl, count: payload.length });
        if (active()) applyLessonExercisePayload(set, payload);
        return;
      }
      if (!this.hasToken()) {
        logTasks("lesson:skip-api-no-token", { lessonId });
        return;
      }
      const payload = await this.fetchExercises(lessonId);
      logTasks("lesson:loaded-api", { lessonId, count: payload.length });
      if (active()) applyLessonExercisePayload(set, payload);
    } catch (e) {
      logError("[TASKS]", e, { phase: "load-exercises", lessonId });
    }
  }
  async runLessonLoadWithLoading(
    lessonId: string,
    pl: PersonalizationLevel | undefined,
    active: () => boolean,
    setLoading: (v: boolean) => void,
    set: LessonExerciseSetters,
  ): Promise<void> {
    setLoading(true);
    await this.loadExercisesIntoState(lessonId, pl, active, set);
    if (active()) setLoading(false);
  }
}
