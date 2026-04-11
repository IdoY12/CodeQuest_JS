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
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_07(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Senior track",
      title: "Collections, iteration, and data shaping",
      description: "Array methods, destructuring, and immutable-style updates",
      estimatedMinutes: 14,
      orderIndex: 1,
      difficulty: "SENIOR",
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
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does reduce return here?",
          codeSnippet: "const sum = [1, 2, 3].reduce((a, n) => a + n, 0);\nconsole.log(sum);",
          correctAnswer: "6",
          explanation: "The reducer folds values starting from the initial accumulator 0.",
          xpReward: 25,
          options: ["0", "6", "123", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "Why avoid mutating the accumulator array inside reduce?",
          codeSnippet: "// anti-pattern: acc.push inside reduce",
          correctAnswer: "Shared mutable state can surprise readers and break referential clarity",
          explanation: "Prefer returning a new accumulator value instead of pushing in place.",
          xpReward: 25,
          options: [
            "JavaScript forbids push in reduce",
            "Shared mutable state can surprise readers and break referential clarity",
            "reduce always freezes arrays",
            "push returns void so reduce breaks",
          ],
        },
      ],
    }, order);
}
