/**
 * Deletes existing curriculum, duel, and badge rows before re-seeding.
 *
 * Responsibility: ordered wipe so FK constraints remain satisfied.
 * Layer: backend prisma seed
 * Depends on: @prisma/client
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";

export async function seedCleanup(prisma: PrismaClient): Promise<void> {
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.userExerciseHistory.deleteMany();
  await prisma.exerciseOption.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.duelQuestion.deleteMany();
}
