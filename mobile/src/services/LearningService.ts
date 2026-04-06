import AuthAware from "@/services/AuthAware";
import type Chapter from "@/models/Chapter";
import type Lesson from "@/models/Lesson";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";

export default class LearningService extends AuthAware {
  constructor(jwt: string) {
    super(jwt);
  }

  async getChapters(path: string): Promise<Chapter[]> {
    const { data } = await this.axiosInstance.get<Chapter[]>(`/learning/chapters/${path}`);
    return data;
  }

  async getLessons(chapterId: string): Promise<Lesson[]> {
    const { data } = await this.axiosInstance.get<Lesson[]>(`/learning/lessons/${chapterId}`);
    return data;
  }

  async getExercises(lessonId: string): Promise<Exercise[]> {
    const { data } = await this.axiosInstance.get<Exercise[]>(`/learning/exercises/${lessonId}`);
    return data;
  }

  async submitExercise(exerciseId: string, answer: string): Promise<ExerciseSubmitResult> {
    const { data } = await this.axiosInstance.post<ExerciseSubmitResult>("/learning/submit-exercise", {
      exerciseId,
      answer,
      timeTakenMs: 1000,
      attempts: 1,
    });
    return data;
  }
}
