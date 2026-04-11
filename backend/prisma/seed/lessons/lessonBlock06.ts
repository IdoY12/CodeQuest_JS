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

export async function seedLessonBlock_06(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Mid track",
      title: "Async flow and debugging",
      description: "Promises, await, and common pitfalls",
      estimatedMinutes: 14,
      orderIndex: 3,
      difficulty: "MID",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this log first?",
          codeSnippet: "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
          correctAnswer: "A then C then B",
          explanation: "Synchronous logs run before microtask callbacks scheduled by Promise.then.",
          xpReward: 25,
          options: ["A then B then C", "A then C then B", "C then A then B", "B then A then C"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What type is `run()` when `run` is async?",
          codeSnippet: "async function run() { return 1; }\nconsole.log(typeof run());",
          correctAnswer: "object",
          explanation: "async functions always return a Promise, whose typeof is 'object'.",
          xpReward: 25,
          options: ["number", "function", "object", "undefined"],
        },
        {
          type: "CODE_FILL",
          prompt: "Fill the blank to wait for the Promise result inside an async function.",
          codeSnippet: "async function load() {\n  const data = ___ fetch('/api');\n}",
          correctAnswer: "await",
          explanation: "`await` pauses the async function until the Promise settles.",
          xpReward: 25,
          options: ["await", "return", "yield", "async"],
        },
        {
          type: "FIND_THE_BUG",
          prompt: "Tap the line that forgets to await a Promise-returning call.",
          codeSnippet: "async function save() {\n  const ok = writeFile('log.txt', 'done');\n  return ok;\n}",
          correctAnswer: "2",
          explanation: "`writeFile` returns a Promise; await it (or return the chain) before treating it as a boolean.",
          xpReward: 25,
          options: ["1", "2", "3", "4"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `Promise.all` do if one input Promise rejects?",
          codeSnippet: "await Promise.all([ok1, fail, ok2]);",
          correctAnswer: "Rejects immediately with that rejection",
          explanation: "Promise.all short-circuits on the first rejection.",
          xpReward: 25,
          options: [
            "Waits for all to finish and returns mixed results",
            "Rejects immediately with that rejection",
            "Resolves to undefined",
            "Throws synchronously before awaiting",
          ],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the API that runs tasks concurrently and keeps fulfilled results.",
          codeSnippet: "const results = await Promise.___([p1, p2]);",
          correctAnswer: "allSettled",
          explanation: "`allSettled` waits for every Promise and reports status per entry.",
          xpReward: 25,
          options: ["allSettled", "race", "any", "defer"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is a safe pattern to avoid unhandled rejections in an async IIFE?",
          codeSnippet: "(async () => { await work(); })();",
          correctAnswer: "Attach `.catch` to the returned Promise or use top-level await in a module",
          explanation: "Fire-and-forget async calls still return a Promise that can reject.",
          xpReward: 25,
          options: [
            "Wrap the body in JSON.stringify",
            "Attach `.catch` to the returned Promise or use top-level await in a module",
            "Prefix with void to silence errors",
            "Use setTimeout(0) around await",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `JSON.parse(JSON.stringify(obj))` lose?",
          codeSnippet: "// deep clone via JSON",
          correctAnswer: "Functions, `undefined`, Symbols, and some nested types",
          explanation: "JSON serialization only preserves JSON-safe data shapes.",
          xpReward: 25,
          options: [
            "Only string keys",
            "Functions, `undefined`, Symbols, and some nested types",
            "Nothing; it is a perfect clone",
            "Only numbers",
          ],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the helper that formats an Error with stack trace for logs.",
          codeSnippet: "try { risky(); } catch (e) { console.___(e); }",
          correctAnswer: "error",
          explanation: "`console.error` is the usual choice for printing exceptions.",
          xpReward: 25,
          options: ["error", "log", "table", "clear"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `queueMicrotask` schedule compared to `setTimeout(fn, 0)`?",
          codeSnippet: "// scheduling",
          correctAnswer: "Microtasks run before the next macrotask turn",
          explanation: "Microtask queue drains before rendering or timer callbacks in the macrotask queue.",
          xpReward: 25,
          options: [
            "They always run in the same tick",
            "Microtasks run before the next macrotask turn",
            "Timers always run first",
            "Microtasks never run on the web",
          ],
        },
      ],
    }, order);
}
