import type Exercise from "@/models/Exercise";
import type { PersonalizationLevel } from "@/data/personalizedExercisePool";
import LearningService from "@/services/LearningService";
import { applyLessonExercisePayload, type LessonExerciseSetters } from "@/utils/lessonExerciseState";
import { logError, logTasks } from "@/utils/logger";

export async function runLessonExerciseLoad(
  lessonId: string,
  personalizedLevel: PersonalizationLevel | undefined,
  jwt: string | null,
  active: () => boolean,
  setLoading: (v: boolean) => void,
  set: LessonExerciseSetters,
): Promise<void> {
  setLoading(true);
  try {
    if (personalizedLevel) {
      const { getExercisePoolForLevel } = await import("@/data/personalizedExercisePool");
      const payload = getExercisePoolForLevel(personalizedLevel);
      logTasks("lesson:loaded-personalized", { level: personalizedLevel, count: payload.length });
      if (active()) applyLessonExercisePayload(set, payload);
      return;
    }
    if (!jwt) {
      logTasks("lesson:skip-api-no-token", { lessonId });
      return;
    }
    const learning = new LearningService(jwt);
    const payload: Exercise[] = await learning.getExercises(lessonId);
    logTasks("lesson:loaded-api", { lessonId, count: payload.length });
    if (active()) applyLessonExercisePayload(set, payload);
  } catch (e) {
    logError("[TASKS]", e, { phase: "load-exercises", lessonId });
  } finally {
    if (active()) setLoading(false);
  }
}
