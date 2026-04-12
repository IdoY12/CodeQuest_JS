import type { Experience } from "@/redux/profile-slice";
import LearningService from "@/services/LearningService";
import { applyLessonExercisePayload, type LessonExerciseSetters } from "@/utils/lessonExerciseState";
import { logError, logTasks } from "@/utils/logger";

export const EXERCISES_PER_BLOCK = 10;

export async function runLessonExerciseLoad(
  experienceLevel: Experience,
  jwt: string | null,
  blockIndex: number,
  active: () => boolean,
  setLoading: (v: boolean) => void,
  set: LessonExerciseSetters,
): Promise<void> {
  setLoading(true);
  try {
    const learning = new LearningService(jwt ?? "");
    const allExercises = await learning.getExercisesForLevel(experienceLevel);
    const blockStart = blockIndex * EXERCISES_PER_BLOCK;
    const blockExercises = allExercises.slice(blockStart, blockStart + EXERCISES_PER_BLOCK);

    let startIndex = 0;
    if (jwt) {
      try {
        const resume = await learning.getResumeForLevel(experienceLevel);
        const resumeWithinBlock = resume.currentExerciseIndex - blockStart;
        if (resumeWithinBlock > 0 && resumeWithinBlock < blockExercises.length) {
          startIndex = resumeWithinBlock;
        }
      } catch {
        // resume is a best-effort optimisation; start from 0 on failure
      }
    }

    logTasks("lesson:loaded-api", { experienceLevel, blockIndex, count: blockExercises.length, startIndex });
    if (active()) applyLessonExercisePayload(set, blockExercises, startIndex);
  } catch (e) {
    logError("[TASKS]", e, { phase: "load-exercises", experienceLevel, blockIndex });
  } finally {
    if (active()) setLoading(false);
  }
}
