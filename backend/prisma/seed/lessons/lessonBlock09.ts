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

export async function seedLessonBlock_09(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Array Methods"),
      title: "Mapping, Filtering, and Reduction",
      description: "Core array method behavior and edge cases",
      estimatedMinutes: 14,
      orderIndex: 1,
      difficulty: "ADVANCED",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the result?",
          codeSnippet: "const out = [1,2,3].map(n => n * 2);\nconsole.log(out);",
          correctAnswer: "[2, 4, 6]",
          explanation: "map returns a new array with transformed values.",
          xpReward: 25,
          options: ["[1, 2, 3]", "[2, 4, 6]", "6", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does filter return when no element matches?",
          codeSnippet: "const out = [1,2,3].filter(n => n > 10);\nconsole.log(out);",
          correctAnswer: "[]",
          explanation: "filter always returns an array, empty when no match exists.",
          xpReward: 25,
          options: ["null", "undefined", "[]", "[0]"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Which token correctly completes this expression?",
          codeSnippet: "const ids = users.___(u => u.active);",
          correctAnswer: "filter",
          explanation: "filter keeps only elements where predicate returns true.",
          xpReward: 25,
          options: ["map", "filter", "reduce", "forEach"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does find return if no item matches?",
          codeSnippet: "const user = [{id:1}].find(u => u.id === 2);\nconsole.log(user);",
          correctAnswer: "undefined",
          explanation: "find returns undefined when it cannot find a match.",
          xpReward: 25,
          options: ["null", "[]", "undefined", "{}"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "const result = [1,2,3].every(n => n > 0);\nconsole.log(result);",
          correctAnswer: "true",
          explanation: "every returns true only when all items satisfy the predicate.",
          xpReward: 25,
          options: ["true", "false", "3", "undefined"],
        },
      ],
    });
}
