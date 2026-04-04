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

export async function seedLessonBlock_16(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Error Handling and Edge Cases"),
      title: "Handling Failure Correctly",
      description: "Catch runtime exceptions and avoid null access crashes",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "ADVANCED",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does try/catch catch?",
          codeSnippet: "try { JSON.parse('{bad'); } catch (e) { console.log('caught'); }",
          correctAnswer: "Runtime exceptions thrown inside try",
          explanation: "catch handles exceptions thrown during runtime execution.",
          xpReward: 25,
          options: ["All syntax errors at compile time", "Runtime exceptions thrown inside try", "Network latency", "Type declarations"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What happens here?",
          codeSnippet: "const x = null;\nconsole.log(x.name);",
          correctAnswer: "Throws a TypeError",
          explanation: "You cannot access properties on null.",
          xpReward: 25,
          options: ["undefined", "null", "Throws a TypeError", "''"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does JSON.parse do with invalid JSON?",
          codeSnippet: "JSON.parse('{ name: \"Ada\" }');",
          correctAnswer: "Throws an exception",
          explanation: "Invalid JSON syntax causes JSON.parse to throw.",
          xpReward: 25,
          options: ["Returns null", "Fixes and parses it", "Throws an exception", "Returns empty object"],
        },
      ],
    });
}
