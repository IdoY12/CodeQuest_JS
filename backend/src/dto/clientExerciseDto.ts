import type { Exercise, ExerciseOption, ExerciseType } from "@prisma/client";
import type { ClientExerciseOptionDto } from "./clientExerciseOptionDto.js";

export type ClientExerciseDto = {
  id: string;
  type: ExerciseType;
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string | null;
  options: ClientExerciseOptionDto[];
};

export type ExerciseWithOptions = Exercise & { options: ExerciseOption[] };
