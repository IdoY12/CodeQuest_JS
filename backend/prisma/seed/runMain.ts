/**
 * Prisma seed orchestrator: wipes, flat curriculum, duel content, daily puzzles.
 *
 * Responsibility: call ordered seed steps and disconnect Prisma.
 * Layer: backend prisma seed
 * Consumers: prisma CLI via package.json script
 */

import { PrismaClient } from "@prisma/client";
import { injectDatabaseUrlFromConfig } from "@project/db";
import { persistDuelQuestions } from "./duel/persistDuelQuestions.js";
import { runAllLessonBlocks } from "./lessons/runAllLessonBlocks.js";
import { seedCleanup } from "./seedCleanup.js";
import { seedDailyPuzzles } from "./dailyPuzzles.js";

injectDatabaseUrlFromConfig();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await seedCleanup(prisma);
  await runAllLessonBlocks(prisma);
  await persistDuelQuestions(prisma);
  await seedDailyPuzzles(prisma);
  console.log("Seed complete: exercises, duel questions, daily puzzles.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
