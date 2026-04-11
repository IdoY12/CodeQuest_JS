import type Exercise from "@/models/Exercise";
import type { Experience } from "@/redux/profile-slice";
import LearningService from "@/services/LearningService";
import { applyLessonExercisePayload, type LessonExerciseSetters } from "@/utils/lessonExerciseState";
import { logError, logTasks } from "@/utils/logger";

export async function runLessonExerciseLoad(
  experienceLevel: Experience,
  jwt: string | null,
  active: () => boolean,
  setLoading: (v: boolean) => void,
  set: LessonExerciseSetters,
): Promise<void> {
  setLoading(true);
  try {
    const learning = new LearningService(jwt ?? "");
    const [resume, payload] = await Promise.all([
      learning.getResumeForLevel(experienceLevel),
      learning.getExercisesForLevel(experienceLevel),
    ]);
    const maxStart = Math.max(0, payload.length - 1);
    const startIndex = Math.min(Math.max(0, resume.currentExerciseIndex), maxStart);
    logTasks("lesson:loaded-api", { experienceLevel, count: payload.length, startIndex });
    if (active()) applyLessonExercisePayload(set, payload, startIndex);
  } catch (e) {
    logError("[TASKS]", e, { phase: "load-exercises", experienceLevel });
  } finally {
    if (active()) setLoading(false);
  }
}
