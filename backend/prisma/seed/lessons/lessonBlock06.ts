/**
 * Seeds curriculum lesson block 06 — Mid track, Async & Debugging.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_06(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Mid track",
    title: "Async flow and debugging",
    description: "Promises, async/await, try/catch, and common async pitfalls",
    estimatedMinutes: 14,
    orderIndex: 3,
    difficulty: "MID",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `async` before a function guarantee about its return value?",
        codeSnippet: "async function getData() {\n  return 42;\n}",
        correctAnswer: "It always returns a Promise",
        explanation: "Any async function always returns a Promise, even when you return a plain value.",
        options: [
          "It returns the value directly",
          "It always returns a Promise",
          "It runs synchronously",
          "It never throws",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `await` do inside an async function?",
        codeSnippet: "async function load() {\n  const data = await fetchData();\n}",
        correctAnswer: "Pauses the current function until the Promise resolves",
        explanation: "await suspends only the current async function, allowing the event loop to process other work.",
        options: [
          "Blocks the entire JavaScript thread",
          "Pauses the current function until the Promise resolves",
          "Converts a callback to a Promise",
          "Skips errors",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `.catch(handler)` handle?",
        codeSnippet: "fetch('/api').catch(err => console.error(err));",
        correctAnswer: "Rejected Promises or thrown errors",
        explanation: ".catch handles rejections and any errors thrown earlier in the Promise chain.",
        options: [
          "Resolved Promise values",
          "Rejected Promises or thrown errors",
          "Pending Promise states",
          "Timeout errors only",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is stored in `result` when `await` is accidentally omitted?",
        codeSnippet: "async function run() {\n  const result = fetch('/api/data');\n  console.log(result);\n}",
        correctAnswer: "A Promise object, not the resolved value",
        explanation: "Without await, you receive the Promise itself. Forgetting await is a common async bug.",
        options: [
          "The API response data",
          "A Promise object, not the resolved value",
          "undefined",
          "A TypeError",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does this eventually resolve to?",
        codeSnippet: "Promise.resolve(5).then(v => v * 2)",
        correctAnswer: "10",
        explanation: "Promise.resolve(5) creates a resolved promise; .then multiplies by 2, producing 10.",
        options: ["5", "10", "Promise(10)", "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `setTimeout(fn, 0)` guarantee?",
        codeSnippet: "setTimeout(() => console.log('async'), 0);\nconsole.log('sync');",
        correctAnswer: "fn runs after all synchronous code completes",
        explanation: "Even with delay 0, setTimeout schedules fn in the macrotask queue, after synchronous code and microtasks.",
        options: [
          "fn runs immediately",
          "fn runs before any Promises resolve",
          "fn runs after all synchronous code completes",
          "fn runs exactly 0 ms later",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "How can you handle errors in async/await?",
        codeSnippet: "async function load() {\n  try {\n    await riskyOp();\n  } catch (e) { }\n}",
        correctAnswer: "Both try/catch and .catch() on the returned Promise",
        explanation: "Errors can be caught with try/catch inside the function, or with .catch() on the Promise it returns.",
        options: [
          "Only try/catch inside the function",
          "Only .catch() on the call site",
          "Both try/catch and .catch() on the returned Promise",
          "Async functions never throw",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `try/catch` catch?",
        codeSnippet: "try {\n  throw new Error('oops');\n} catch (e) {\n  console.log(e.message);\n}",
        correctAnswer: "Any thrown value within the try block",
        explanation: "try/catch catches any thrown value — Error objects, strings, numbers — from within the try block.",
        options: [
          "Only network errors",
          "Only TypeError instances",
          "Only syntax errors",
          "Any thrown value within the try block",
        ],
      },
      {
        type: "CODE_FILL",
        prompt: "Fill in the keyword that marks a function as asynchronous.",
        codeSnippet: "___ function loadUser() {\n  const user = await fetchUser();\n  return user;\n}",
        correctAnswer: "async",
        explanation: "The async keyword enables await inside a function and makes it return a Promise.",
        options: ["async", "await", "Promise", "defer"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the most common cause of an 'unhandled promise rejection' warning?",
        codeSnippet: "fetch('/missing'); // no .catch",
        correctAnswer: "A Promise that rejects with no .catch or try/catch",
        explanation: "Any rejected Promise without an error handler triggers an unhandled rejection warning.",
        options: [
          "Using async/await instead of .then()",
          "A Promise that rejects with no .catch or try/catch",
          "Calling await outside an async function",
          "Using setTimeout inside a Promise",
        ],
      },
    ],
  }, order);
}
