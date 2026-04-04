/**
 * Prisma seed orchestrator: wipes, paths, lessons, duel content, puzzles, badges.
 *
 * Responsibility: call ordered seed steps and disconnect Prisma.
 * Layer: backend prisma seed
 * Depends on: seed/* modules, @project/db inject, PrismaClient
 * Consumers: prisma CLI via package.json script
 */

import { PrismaClient } from "@prisma/client";
import { injectDatabaseUrlFromConfig } from "@project/db";
import { persistDuelQuestions } from "./duel/persistDuelQuestions.js";
import { runAllLessonBlocks } from "./lessons/runAllLessonBlocks.js";
import { seedBadges } from "./seedBadges.js";
import { seedCleanup } from "./seedCleanup.js";
import { seedDailyPersonalized } from "./seedDailyPersonalized.js";
import { seedPathsAndChapters } from "./seedPathsAndChapters.js";

injectDatabaseUrlFromConfig();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await seedCleanup(prisma);
  const chapterByTitle = await seedPathsAndChapters(prisma);
  await runAllLessonBlocks(prisma, chapterByTitle);
  await persistDuelQuestions(prisma);
  await seedDailyPersonalized(prisma);
  await seedBadges(prisma);
  console.log("Seed complete: paths, chapters, lessons, exercises, duel questions, badges.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
