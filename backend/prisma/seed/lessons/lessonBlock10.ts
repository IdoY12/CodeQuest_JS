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

export async function seedLessonBlock_10(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Closures and Scope"),
      title: "Scope and Closure Behavior",
      description: "Track lexical environment and captured values",
      estimatedMinutes: 12,
      orderIndex: 1,
      difficulty: "ADVANCED",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "function makeCounter(){ let c = 0; return () => ++c; }\nconst count = makeCounter();\nconsole.log(count(), count());",
          correctAnswer: "1 2",
          explanation: "The inner function closes over c and preserves state between calls.",
          xpReward: 25,
          options: ["1 1", "1 2", "2 2", "0 1"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What prints in this loop?",
          codeSnippet: "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }",
          correctAnswer: "3 3 3",
          explanation: "var is function-scoped, so callbacks see final value after loop.",
          xpReward: 25,
          options: ["0 1 2", "3 3 3", "2 2 2", "throws error"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What prints with let in the same pattern?",
          codeSnippet: "for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }",
          correctAnswer: "0 1 2",
          explanation: "let creates a new binding each iteration.",
          xpReward: 25,
          options: ["3 3 3", "0 1 2", "1 2 3", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "Which variable is visible here?",
          codeSnippet: "{ const secret = 42; }\nconsole.log(typeof secret);",
          correctAnswer: "undefined",
          explanation: "secret is block-scoped and unavailable outside the block.",
          xpReward: 25,
          options: ["42", "undefined", "number", "secret"],
        },
      ],
    });
}
