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

export async function seedLessonBlock_12(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Async JavaScript",
      title: "Execution Order and Awaiting Promises",
      description: "Reason about event loop and async return values",
      estimatedMinutes: 14,
      orderIndex: 1,
      difficulty: "SENIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What order is logged?",
          codeSnippet: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));",
          correctAnswer: "A, C, B",
          explanation: "Sync logs first, then microtasks, then macrotasks.",
          xpReward: 25,
          options: ["A, B, C", "A, C, B", "C, A, B", "B, C, A"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does an async function return?",
          codeSnippet: "async function run(){ return 5; }\nconsole.log(run());",
          correctAnswer: "A Promise",
          explanation: "async wraps return values in a Promise.",
          xpReward: 25,
          options: ["5", "undefined", "A Promise", "An object literal"],
        },
        {
          type: "FIND_THE_BUG",
          prompt: "Tap the line with the async bug.",
          codeSnippet: "async function fetchName(){\n  const res = axios.get('/user');\n  return (await res).data;\n}",
          correctAnswer: "2",
          explanation: "axios.get returns a Promise and should be awaited before using the response.",
          xpReward: 25,
          options: ["1", "2", "3", "4"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is printed?",
          codeSnippet: "async function x(){ try { throw new Error('x'); } catch { return 'handled'; } }\nx().then(console.log);",
          correctAnswer: "handled",
          explanation: "The catch block handles the thrown error and returns a value.",
          xpReward: 25,
          options: ["x", "handled", "undefined", "unhandled rejection"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Choose the missing keyword.",
          codeSnippet: "const user = /* blank */ getUser();",
          correctAnswer: "await",
          explanation: "Use await inside an async function to resolve a Promise result.",
          xpReward: 25,
          options: ["await", "return", "yield", "new"],
        },
      ],
    }, order);
}
