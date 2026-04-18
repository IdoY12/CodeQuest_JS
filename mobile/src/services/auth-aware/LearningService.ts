import AuthAware from "./AuthAware";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { getStreakCalendarDate } from "@/utils/streakCalendar";

type LearningResume = { experienceLevel: string; currentExerciseIndex: number };

export default class LearningService extends AuthAware {
  async getResumeForLevel(experienceLevel: string): Promise<LearningResume> {
    const { data } = await this.axiosInstance.get<LearningResume>("/learning/resume", { params: { experienceLevel } });
    return data;
  }

  async getExercisesForLevel(experienceLevel: string): Promise<Exercise[]> {
    const { data } = await this.axiosInstance.get<Exercise[]>(`/learning/exercises/${experienceLevel}`);
    return data;
  }

  async submitExercise(
    exerciseId: string,
    answer: string,
    clientLocalDate: string = getStreakCalendarDate(),
  ): Promise<ExerciseSubmitResult> {
    const { data } = await this.axiosInstance.post<ExerciseSubmitResult>("/learning/submit-exercise", {
      exerciseId, answer, clientLocalDate,
    });
    return data;
  }
}
