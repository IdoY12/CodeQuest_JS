/**
 * Builds PersonalizedExercise rows from compact tuple specs and clones pools safely.
 *
 * Responsibility: map ExerciseSpec tuples into full exercise objects.
 * Layer: @project/personalized-exercises
 * Depends on: personalizationTypes.ts
 * Consumers: spec modules, exercisePools.ts
 */

import type { PersonalizedExercise } from "./personalizationTypes.js";

export type ExerciseSpec = [string, string, string, string, string[], string];

export function build(spec: ExerciseSpec): PersonalizedExercise {
  const [id, prompt, codeSnippet, correctAnswer, choiceValues, explanation] = spec;
  return {
    id,
    type: "MULTIPLE_CHOICE",
    prompt,
    codeSnippet,
    correctAnswer,
    explanation,
    xpReward: 20,
    options: choiceValues.map((text, index) => ({ id: `${id}-opt-${index}`, text, isCorrect: text === correctAnswer })),
  };
}

export function copyExercises(list: PersonalizedExercise[]): PersonalizedExercise[] {
  return list.map((exercise) => ({
    ...exercise,
    options: exercise.options.map((option) => ({ ...option })),
  }));
}
