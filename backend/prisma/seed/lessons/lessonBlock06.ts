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

export async function seedLessonBlock_06(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Loops"),
      title: "Loop Fundamentals",
      description: "Understand iteration counts and break behavior",
      estimatedMinutes: 12,
      orderIndex: 1,
      difficulty: "BEGINNER",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "How many times does this loop run?",
          codeSnippet: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
          correctAnswer: "5",
          explanation: "It runs for i = 1,2,3,4,5.",
          xpReward: 20,
          options: ["4", "5", "6", "1"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is i in the final iteration?",
          codeSnippet: "for (let i = 1; i <= 5; i++) {\n  // ...\n}",
          correctAnswer: "5",
          explanation: "The last value satisfying i <= 5 is 5.",
          xpReward: 20,
          options: ["4", "5", "6", "0"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is printed?",
          codeSnippet: "let n = 1;\nwhile (n < 4) {\n  console.log(n);\n  n++;\n}",
          correctAnswer: "1, 2, 3",
          explanation: "The loop prints each value before incrementing until n becomes 4.",
          xpReward: 20,
          options: ["1, 2, 3", "1, 2, 3, 4", "2, 3, 4", "1"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does break do here?",
          codeSnippet: "for (let i = 0; i < 5; i++) {\n  if (i === 2) break;\n}\nconsole.log('done');",
          correctAnswer: "Stops the loop when i is 2",
          explanation: "break exits the loop immediately.",
          xpReward: 20,
          options: ["Skips only i=2", "Stops the loop when i is 2", "Restarts the loop", "Throws an error"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "How many values are logged?",
          codeSnippet: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
          correctAnswer: "3",
          explanation: "Values 0, 1, and 2 are logged.",
          xpReward: 20,
          options: ["2", "3", "4", "1"],
        },
      ],
    });
}
