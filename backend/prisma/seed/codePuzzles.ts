/**
 * Seeds all code puzzle rows from the canonical puzzle list.
 *
 * Responsibility: upsert every CodePuzzle row keyed by orderIndex.
 * Layer: backend prisma seed
 * Depends on: @prisma/client, codePuzzleSeed.shard*
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";
import { CODE_PUZZLE_SHARD_0 } from "./codePuzzleSeed.shard0.js";
import { CODE_PUZZLE_SHARD_1 } from "./codePuzzleSeed.shard1.js";
import { CODE_PUZZLE_SHARD_2 } from "./codePuzzleSeed.shard2.js";

const puzzles = [...CODE_PUZZLE_SHARD_0, ...CODE_PUZZLE_SHARD_1, ...CODE_PUZZLE_SHARD_2];

export async function seedCodePuzzles(prisma: PrismaClient): Promise<void> {
  await Promise.all(
    puzzles.map((puzzle) =>
      prisma.codePuzzle.upsert({
        where: { orderIndex: puzzle.orderIndex },
        update: { prompt: puzzle.prompt, acceptedAnswers: puzzle.acceptedAnswers, testCases: puzzle.testCases },
        create: puzzle,
      }),
    ),
  );
}
