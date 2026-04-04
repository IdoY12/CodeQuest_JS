/**
 * Creates a lesson row plus dependent exercises and MCQ options in Prisma.
 *
 * Responsibility: transactional curriculum insert helper for seed scripts.
 * Layer: backend prisma seed
 * Depends on: seedExerciseTypes.ts, @prisma/client
 * Consumers: seed/lessons/*.ts
 */

import type { PrismaClient } from "@prisma/client";
import type { SeedExercise } from "./seedExerciseTypes.js";

export async function createLessonWithExercises(
  prisma: PrismaClient,
  params: {
    chapterId: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    orderIndex: number;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    exercises: SeedExercise[];
  },
): Promise<void> {
  const lesson = await prisma.lesson.create({
    data: {
      chapterId: params.chapterId,
      title: params.title,
      description: params.description,
      estimatedMinutes: params.estimatedMinutes,
      orderIndex: params.orderIndex,
      difficulty: params.difficulty,
    },
  });

  for (let i = 0; i < params.exercises.length; i += 1) {
    const exercise = params.exercises[i];
    const created = await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        type: exercise.type,
        prompt: exercise.prompt,
        codeSnippet: exercise.codeSnippet,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
        orderIndex: i + 1,
        xpReward: exercise.xpReward,
      },
    });

    if (exercise.options && exercise.options.length > 0) {
      await prisma.exerciseOption.createMany({
        data: exercise.options.map((option) => ({
          exerciseId: created.id,
          text: option,
          isCorrect: option === exercise.correctAnswer,
        })),
      });
    }
  }
}
