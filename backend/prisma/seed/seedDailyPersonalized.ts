/**
 * Seeds daily puzzles and personalized warm-up exercises from shared content packages.
 *
 * Responsibility: reset puzzle + personalized tables then insert authoritative rows.
 * Layer: backend prisma seed
 * Depends on: @prisma/client, @project/daily-puzzles, @project/personalized-exercises
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";
import { dailyPuzzleBank } from "@project/daily-puzzles";
import type { PersonalizationLevel } from "@project/personalized-exercises";
import { getExercisePoolForLevel } from "@project/personalized-exercises";

const PERSONALIZATION_LEVELS: PersonalizationLevel[] = ["BEGINNER", "BASICS", "INTERMEDIATE", "ADVANCED"];

export async function seedDailyPersonalized(prisma: PrismaClient): Promise<void> {
  await prisma.dailyPuzzle.deleteMany();
  await prisma.personalizedExercise.deleteMany();

  await prisma.dailyPuzzle.createMany({
    data: dailyPuzzleBank.map((puzzle, index) => ({
      id: puzzle.id,
      prompt: puzzle.prompt,
      acceptedAnswers: puzzle.acceptedAnswers,
      orderIndex: index,
    })),
  });

  for (const level of PERSONALIZATION_LEVELS) {
    const exercises = getExercisePoolForLevel(level);
    await prisma.personalizedExercise.createMany({
      data: exercises.map((exercise, index) => ({
        id: exercise.id,
        level,
        type: exercise.type,
        prompt: exercise.prompt,
        codeSnippet: exercise.codeSnippet,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
        xpReward: exercise.xpReward,
        orderIndex: index + 1,
        options: exercise.options.map((option) => ({ text: option.text, isCorrect: option.isCorrect })),
      })),
    });
  }
}
