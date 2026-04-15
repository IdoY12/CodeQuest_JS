/**
 * Runs all curriculum lesson seed blocks in the intended authoring order.
 *
 * Responsibility: orchestrate per-lesson seed modules without bloating runMain.
 * Layer: backend prisma seed
 * Depends on: lessonBlock01..09 modules, createGlobalOrderCounters
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createGlobalOrderCounters } from "../lib/createLessonWithExercises.js";
import { seedLessonBlock_01 } from "./lessonBlock01.js";
import { seedLessonBlock_02 } from "./lessonBlock02.js";
import { seedLessonBlock_03 } from "./lessonBlock03.js";
import { seedLessonBlock_04 } from "./lessonBlock04.js";
import { seedLessonBlock_05 } from "./lessonBlock05.js";
import { seedLessonBlock_06 } from "./lessonBlock06.js";
import { seedLessonBlock_07 } from "./lessonBlock07.js";
import { seedLessonBlock_08 } from "./lessonBlock08.js";
import { seedLessonBlock_09 } from "./lessonBlock09.js";

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
] as const;

export async function runAllLessonBlocks(prisma: PrismaClient): Promise<void> {
  const order = createGlobalOrderCounters();

  await blocks.reduce<Promise<void>>(async (prev, block) => {
    await prev;
    await block(prisma, order);
  }, Promise.resolve());
}
