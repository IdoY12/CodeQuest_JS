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

export async function seedLessonBlock_05(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Conditionals"),
      title: "Branching Logic",
      description: "if/else and ternary operator behavior",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "BEGINNER",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is printed?",
          codeSnippet: "const isMember = true;\nif (isMember) { console.log('Access'); } else { console.log('Denied'); }",
          correctAnswer: "Access",
          explanation: "The if branch runs when condition is true.",
          xpReward: 20,
          options: ["Denied", "Access", "Both", "Nothing"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "const age = 15;\nif (age >= 18) { console.log('Adult'); } else { console.log('Minor'); }",
          correctAnswer: "Minor",
          explanation: "15 is not greater than or equal to 18.",
          xpReward: 20,
          options: ["Adult", "Minor", "undefined", "false"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What value is assigned?",
          codeSnippet: "const online = false;\nconst status = online ? 'On' : 'Off';\nconsole.log(status);",
          correctAnswer: "Off",
          explanation: "Ternary chooses the second value when condition is false.",
          xpReward: 20,
          options: ["On", "Off", "false", "status"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "let points = 0;\nif (points === 0) { points = 10; }\nconsole.log(points);",
          correctAnswer: "10",
          explanation: "Condition is true, so points is updated to 10.",
          xpReward: 20,
          options: ["0", "10", "undefined", "NaN"],
        },
      ],
    });
}
