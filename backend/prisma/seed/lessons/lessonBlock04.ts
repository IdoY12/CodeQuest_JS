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

export async function seedLessonBlock_04(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Operators and Comparisons"),
      title: "Operators You Use Every Day",
      description: "Arithmetic and boolean expression evaluation",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "BEGINNER",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "console.log(6 / 2 + 1);",
          correctAnswer: "4",
          explanation: "6 / 2 is 3, then +1 gives 4.",
          xpReward: 20,
          options: ["3", "4", "7", "12"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does strict equality return?",
          codeSnippet: "console.log(5 === '5');",
          correctAnswer: "false",
          explanation: "=== checks both value and type.",
          xpReward: 20,
          options: ["true", "false", "5", "'5'"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the result?",
          codeSnippet: "console.log(!true);",
          correctAnswer: "false",
          explanation: "! flips a boolean value.",
          xpReward: 20,
          options: ["true", "false", "undefined", "0"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "console.log(true && false || true);",
          correctAnswer: "true",
          explanation: "true && false is false, then false || true is true.",
          xpReward: 20,
          options: ["false", "true", "undefined", "null"],
        },
      ],
    });
}
