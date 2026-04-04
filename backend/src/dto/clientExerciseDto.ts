import type { Exercise, ExerciseOption, ExerciseType } from "@prisma/client";
import type { ClientExerciseOptionDto } from "./clientExerciseOptionDto.js";

export type ClientExerciseDto = {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  codeSnippet: string;
  orderIndex: number;
  xpReward: number;
  options: ClientExerciseOptionDto[];
};

export type ExerciseWithOptions = Exercise & { options: ExerciseOption[] };
