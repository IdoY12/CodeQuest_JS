/**
 * Persists all generated duel question batches via Prisma createMany.
 *
 * Responsibility: combine beginner/advanced pools and insert rows.
 * Layer: backend prisma seed
 * Depends on: duel/*Questions.ts builders, @prisma/client
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";
import { buildAdvancedBugQuestions } from "./duelAdvancedBugQuestions.js";
import { buildAdvancedOutputQuestions } from "./duelAdvancedOutputQuestions.js";
import { buildAdvancedTokenQuestions } from "./duelAdvancedTokenQuestions.js";
import { buildBeginnerBugQuestions } from "./duelBeginnerBugQuestions.js";
import { buildBeginnerOutputQuestions } from "./duelBeginnerOutputQuestions.js";
import { buildBeginnerTokenQuestions } from "./duelBeginnerTokenQuestions.js";

export async function persistDuelQuestions(prisma: PrismaClient): Promise<void> {
  const duelQuestions = [
    ...buildBeginnerOutputQuestions(),
    ...buildBeginnerBugQuestions(),
    ...buildBeginnerTokenQuestions(),
    ...buildAdvancedOutputQuestions(),
    ...buildAdvancedBugQuestions(),
    ...buildAdvancedTokenQuestions(),
  ];
  await prisma.duelQuestion.createMany({ data: duelQuestions });
}
