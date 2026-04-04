import type { ClientPersonalizedExerciseDto, PersonalizedExerciseRow } from "./clientPersonalizedExerciseDto.js";

export function mapPersonalizedExerciseToClientDto(row: PersonalizedExerciseRow): ClientPersonalizedExerciseDto {
  const rawOptions = row.options as Array<{ text: string }>;
  return {
    id: row.id,
    type: row.type,
    prompt: row.prompt,
    codeSnippet: row.codeSnippet,
    xpReward: row.xpReward,
    orderIndex: row.orderIndex,
    options: rawOptions.map((option, index) => ({
      id: `${row.id}-opt-${index}`,
      text: option.text,
    })),
  };
}
