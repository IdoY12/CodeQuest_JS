/**
 * Deletes existing curriculum and duel rows before re-seeding.
 *
 * Responsibility: ordered wipe so FK constraints remain satisfied.
 * Layer: backend prisma seed
 * Depends on: @prisma/client
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";

export async function seedCleanup(prisma: PrismaClient): Promise<void> {
  await prisma.userProgress.deleteMany();
  await prisma.exerciseOption.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.duelQuestion.deleteMany();
}
