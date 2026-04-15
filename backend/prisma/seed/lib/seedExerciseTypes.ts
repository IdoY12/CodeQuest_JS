/**
 * Type definitions for inline curriculum exercises used only by Prisma seeding.
 *
 * Responsibility: document the shape passed into createLessonWithExercises.
 * Layer: backend prisma seed
 * Depends on: none
 * Consumers: createLessonWithExercises.ts
 */

export interface SeedExercise {
  type: "CONCEPT_CARD" | "MULTIPLE_CHOICE" | "FIND_THE_BUG" | "DRAG_DROP" | "CODE_FILL" | "TAP_TOKEN";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string;
  options?: string[];
}
