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

export async function seedLessonBlock_03(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Data Types"),
      title: "Primitive Types and typeof",
      description: "Recognize JS primitive values and type checks",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "BEGINNER",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "console.log(typeof '5');",
          correctAnswer: "string",
          explanation: "Quotes make 5 a string value.",
          xpReward: 20,
          options: ["number", "string", "boolean", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the result?",
          codeSnippet: "console.log(typeof 5);",
          correctAnswer: "number",
          explanation: "Without quotes, 5 is a number.",
          xpReward: 20,
          options: ["string", "number", "boolean", "object"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the value that is falsy.",
          codeSnippet: "const candidates = [0, 'hello', 9, true];",
          correctAnswer: "0",
          explanation: "0 is one of JavaScript's falsy values.",
          xpReward: 20,
          options: ["0", "'hello'", "9", "true"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the value whose typeof is 'undefined'.",
          codeSnippet: "const value = undefined;\nconsole.log(typeof value);",
          correctAnswer: "undefined",
          explanation: "The literal undefined has typeof 'undefined'.",
          xpReward: 20,
          options: ["null", "undefined", "false", "0"],
        },
      ],
    });
}
