import type { ClientExerciseDto, ExerciseWithOptions } from "./clientExerciseDto.js";

export function mapExerciseRowToClientDto(row: ExerciseWithOptions): ClientExerciseDto {
  return {
    id: row.id,
    lessonId: row.lessonId,
    type: row.type,
    prompt: row.prompt,
    codeSnippet: row.codeSnippet,
    orderIndex: row.orderIndex,
    xpReward: row.xpReward,
    options: row.options.map((option) => ({ id: option.id, text: option.text })),
  };
}
