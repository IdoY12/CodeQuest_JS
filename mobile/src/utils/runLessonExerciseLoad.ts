import type Exercise from "@/models/Exercise";
import type { Experience } from "@/redux/profile-slice";
import LearningService from "@/services/LearningService";
import { applyLessonExercisePayload, type LessonExerciseSetters } from "@/utils/lessonExerciseState";
import { logError, logTasks } from "@/utils/logger";

function mapExperienceToPoolLevel(level: Experience): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" {
  if (level === "SENIOR") return "ADVANCED";
  if (level === "MID") return "INTERMEDIATE";
  return "BEGINNER";
}

function parsePersonalizedBlockWindow(lessonId: string): { start: number; end: number } {
  const m = lessonId.match(/-block-(\d+)$/);
  const block = m ? Number(m[1]) : 1;
  const safe = Number.isFinite(block) && block >= 1 && block <= 3 ? block : 1;
  const start = (safe - 1) * 10;
  return { start, end: start + 10 };
}

export async function runLessonExerciseLoad(
  lessonId: string,
  personalizedLevel: Experience | undefined,
  jwt: string | null,
  initialExerciseIndex: number,
  active: () => boolean,
  setLoading: (v: boolean) => void,
  set: LessonExerciseSetters,
): Promise<void> {
  setLoading(true);
  try {
    if (personalizedLevel) {
      const { getExercisePoolForLevel } = await import("@/data/personalizedExercisePool");
      const all = getExercisePoolForLevel(mapExperienceToPoolLevel(personalizedLevel)).slice(0, 30);
      const window = parsePersonalizedBlockWindow(lessonId);
      const payload = all.slice(window.start, window.end);
      logTasks("lesson:loaded-personalized", { level: personalizedLevel, count: payload.length });
      if (active()) applyLessonExercisePayload(set, payload, initialExerciseIndex);
      return;
    }
    if (!jwt) {
      logTasks("lesson:skip-api-no-token", { lessonId });
      return;
    }
    const learning = new LearningService(jwt);
    const payload: Exercise[] = await learning.getExercises(lessonId);
    logTasks("lesson:loaded-api", { lessonId, count: payload.length });
    if (active()) applyLessonExercisePayload(set, payload, initialExerciseIndex);
  } catch (e) {
    logError("[TASKS]", e, { phase: "load-exercises", lessonId });
  } finally {
    if (active()) setLoading(false);
  }
}
