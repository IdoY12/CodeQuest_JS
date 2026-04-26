/**
 * Type definitions for inline curriculum exercises used only by Prisma seeding.
 *
 * Responsibility: document the shape passed into createLessonWithExercises.
 * Layer: backend prisma seed
 * Depends on: none
 * Consumers: createLessonWithExercises.ts
 */

export interface SeedExercise {
  type: "MCQ" | "PUZZLE";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string;
  options?: string[];
}
