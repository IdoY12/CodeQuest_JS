import type { Exercise, ExerciseOption, ExerciseType, ExperienceLevel } from "@prisma/client";
import type { ClientExerciseOptionDto } from "./clientExerciseOptionDto.js";

export type ClientExerciseDto = {
  id: string;
  experienceLevel: ExperienceLevel;
  sectionLabel: string | null;
  type: ExerciseType;
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string | null;
  orderIndex: number;
  xpReward: number;
  options: ClientExerciseOptionDto[];
};

export type ExerciseWithOptions = Exercise & { options: ExerciseOption[] };
