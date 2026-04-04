/**
 * Runs all curriculum lesson seed blocks in the intended authoring order.
 *
 * Responsibility: orchestrate per-lesson seed modules without bloating runMain.
 * Layer: backend prisma seed
 * Depends on: lessonBlock01..16 modules
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";
import { seedLessonBlock_01 } from "./lessonBlock01.js";
import { seedLessonBlock_02 } from "./lessonBlock02.js";
import { seedLessonBlock_03 } from "./lessonBlock03.js";
import { seedLessonBlock_04 } from "./lessonBlock04.js";
import { seedLessonBlock_05 } from "./lessonBlock05.js";
import { seedLessonBlock_06 } from "./lessonBlock06.js";
import { seedLessonBlock_07 } from "./lessonBlock07.js";
import { seedLessonBlock_08 } from "./lessonBlock08.js";
import { seedLessonBlock_09 } from "./lessonBlock09.js";
import { seedLessonBlock_10 } from "./lessonBlock10.js";
import { seedLessonBlock_11 } from "./lessonBlock11.js";
import { seedLessonBlock_12 } from "./lessonBlock12.js";
import { seedLessonBlock_13 } from "./lessonBlock13.js";
import { seedLessonBlock_14 } from "./lessonBlock14.js";
import { seedLessonBlock_15 } from "./lessonBlock15.js";
import { seedLessonBlock_16 } from "./lessonBlock16.js";

const blocks = [
  seedLessonBlock_01,
  seedLessonBlock_02,
  seedLessonBlock_03,
  seedLessonBlock_04,
  seedLessonBlock_05,
  seedLessonBlock_06,
  seedLessonBlock_07,
  seedLessonBlock_08,
  seedLessonBlock_09,
  seedLessonBlock_10,
  seedLessonBlock_11,
  seedLessonBlock_12,
  seedLessonBlock_13,
  seedLessonBlock_14,
  seedLessonBlock_15,
  seedLessonBlock_16,
] as const;

export async function runAllLessonBlocks(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
  for (const block of blocks) {
    await block(prisma, chapterByTitle);
  }
}
