import type { ExerciseType, PersonalizedExercise } from "@prisma/client";
import type { ClientExerciseOptionDto } from "./clientExerciseOptionDto.js";

export type ClientPersonalizedExerciseDto = {
  id: string;
  type: ExerciseType;
  prompt: string;
  codeSnippet: string;
  xpReward: number;
  orderIndex: number;
  options: ClientExerciseOptionDto[];
};

export type PersonalizedExerciseRow = PersonalizedExercise;
