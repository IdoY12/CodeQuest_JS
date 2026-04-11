/**
 * Prisma seed orchestrator: wipes, flat curriculum, duel content.
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

injectDatabaseUrlFromConfig();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await seedCleanup(prisma);
  await runAllLessonBlocks(prisma);
  await persistDuelQuestions(prisma);
  console.log("Seed complete: exercises, duel questions.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
