/**
 * Seeds one curriculum lesson block (exercises + metadata) into Prisma.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js, ../lib/requireChapterId.js
 * Consumers: ../runMain.js
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import { requireChapterId } from "../lib/requireChapterId.js";

export async function seedLessonBlock_13(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Destructuring and Spread"),
      title: "Modern Object and Array Patterns",
      description: "Use concise extraction and merge syntax",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "ADVANCED",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What value does b get?",
          codeSnippet: "const [a, b = 10] = [3];\nconsole.log(b);",
          correctAnswer: "10",
          explanation: "Default values apply when element is missing.",
          xpReward: 25,
          options: ["3", "10", "undefined", "0"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this log?",
          codeSnippet: "const { id: userId } = { id: 7 };\nconsole.log(userId);",
          correctAnswer: "7",
          explanation: "id is renamed to userId during destructuring.",
          xpReward: 25,
          options: ["id", "7", "undefined", "userId"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is merged array?",
          codeSnippet: "const out = [...[1,2], ...[3,4]];\nconsole.log(out);",
          correctAnswer: "[1, 2, 3, 4]",
          explanation: "Spread expands each array into a new combined array.",
          xpReward: 25,
          options: ["[1,2]", "[3,4]", "[1, 2, 3, 4]", "[[1,2],[3,4]]"],
        },
      ],
    });
}
