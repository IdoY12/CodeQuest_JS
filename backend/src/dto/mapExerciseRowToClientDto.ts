import type { ClientExerciseDto, ExerciseWithOptions } from "./clientExerciseDto.js";

export function mapExerciseRowToClientDto(row: ExerciseWithOptions): ClientExerciseDto {
  return {
    id: row.id,
    type: row.type,
    prompt: row.prompt,
    codeSnippet: row.codeSnippet,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation ?? null,
    options: row.options.map((option) => ({ text: option.text })),
  };
}
