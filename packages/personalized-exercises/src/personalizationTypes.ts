/**
 * Public types for personalized warm-up exercises shown in mobile and seeded in DB.
 *
 * Responsibility: shared domain types for MCQ-style personalized content.
 * Layer: @project/personalized-exercises
 * Depends on: none
 * Consumers: buildMcqFromSpec.ts, spec files, index.ts
 */

export type PersonalizationLevel = "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED";

export interface PersonalizedExercise {
  id: string;
  type: "CONCEPT_CARD" | "MULTIPLE_CHOICE" | "FIND_THE_BUG" | "DRAG_DROP" | "CODE_FILL" | "TAP_TOKEN";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
}
