import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import type { ClientExerciseDto, ExerciseWithOptions } from "./clientExerciseDto.js";

export function mapExerciseRowToClientDto(row: ExerciseWithOptions): ClientExerciseDto {
  return {
    id: row.id,
    experienceLevel: row.experienceLevel,
    sectionLabel: row.sectionLabel ?? null,
    type: row.type,
    prompt: row.prompt,
    codeSnippet: row.codeSnippet,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation ?? null,
    orderIndex: row.orderIndex,
    xpReward: XP_PER_CORRECT_EXERCISE,
    options: row.options.map((option) => ({ id: option.id, text: option.text, isCorrect: option.isCorrect })),
  };
}
