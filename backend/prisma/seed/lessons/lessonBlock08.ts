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

export async function seedLessonBlock_08(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Arrays"),
      title: "Array Basics",
      description: "Indexing and length with simple arrays",
      estimatedMinutes: 8,
      orderIndex: 1,
      difficulty: "BEGINNER",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const colors = ['red', 'blue', 'green'];\nconsole.log(colors[1]);",
          correctAnswer: "blue",
          explanation: "Array indexes start at 0, so index 1 is 'blue'.",
          xpReward: 20,
          options: ["red", "blue", "green", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "const nums = [4, 9, 16];\nconsole.log(nums.length);",
          correctAnswer: "3",
          explanation: ".length returns the number of elements in the array.",
          xpReward: 20,
          options: ["2", "3", "4", "16"],
        },
      ],
    });
}
