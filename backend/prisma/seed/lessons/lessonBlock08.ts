/**
 * Seeds curriculum lesson block 08 — Senior track, Performance & Memory.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_08(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Senior track",
    title: "Performance and memory",
    description: "Event loop, microtasks, memory leaks, debounce, throttle, and memoization",
    estimatedMinutes: 16,
    orderIndex: 2,
    difficulty: "SENIOR",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the primary role of the JavaScript event loop?",
        codeSnippet: "// call stack → microtask queue → macrotask queue",
        correctAnswer: "Move tasks from the queue to the call stack when the stack is empty",
        explanation: "The event loop checks if the call stack is empty, then processes microtasks, then one macrotask at a time.",
        xpReward: 30,
        options: [
          "Compile JavaScript before execution",
          "Move tasks from the queue to the call stack when the stack is empty",
          "Manage memory allocation",
          "Handle syntax errors at runtime",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Which queue is always drained before the macrotask queue?",
        codeSnippet: "Promise.resolve().then(() => console.log('micro'));\nsetTimeout(() => console.log('macro'), 0);",
        correctAnswer: "Microtask queue",
        explanation: "Microtasks (resolved Promises, queueMicrotask) are fully drained before the next macrotask runs.",
        xpReward: 30,
        options: ["Animation frame queue", "Microtask queue", "I/O queue", "Timer queue"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is a common cause of memory leaks in JavaScript?",
        codeSnippet: "element.addEventListener('click', heavyHandler);\n// handler never removed — reference stays alive",
        correctAnswer: "Forgotten event listeners that hold references to large objects",
        explanation: "Unremoved event listeners keep their closure's captured variables alive, preventing garbage collection.",
        xpReward: 30,
        options: [
          "Using const instead of let",
          "Forgotten event listeners that hold references to large objects",
          "Creating too many primitive values",
          "Calling JSON.stringify on large objects",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the key difference between debounce and throttle?",
        codeSnippet: "// Debounce: wait 300ms after last keystroke\n// Throttle: fire at most once per 300ms",
        correctAnswer: "Debounce fires after inactivity ends; throttle fires at most once per interval",
        explanation: "Debounce waits for a quiet period before firing; throttle limits how often a function can fire regardless of activity.",
        xpReward: 30,
        options: [
          "Debounce delays once; throttle delays forever",
          "Debounce fires after inactivity ends; throttle fires at most once per interval",
          "Throttle cancels previous calls; debounce does not",
          "They are identical in behaviour",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does memoization do?",
        codeSnippet: "const memo = {};\nfunction fib(n) {\n  if (n in memo) return memo[n];\n  return (memo[n] = n <= 1 ? n : fib(n-1) + fib(n-2));\n}",
        correctAnswer: "Caches results so the same inputs skip recomputation",
        explanation: "Memoization trades memory for speed by storing computed results keyed by input.",
        xpReward: 30,
        options: [
          "Stores function bytecode",
          "Caches results so the same inputs skip recomputation",
          "Monitors memory usage at runtime",
          "Converts synchronous code to async",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is lazy loading?",
        codeSnippet: "const module = await import('./heavy.js'); // loaded on demand",
        correctAnswer: "Deferring resource loading until it is actually needed",
        explanation: "Lazy loading reduces initial bundle size and startup time by only fetching code or assets when required.",
        xpReward: 30,
        options: [
          "Deferring resource loading until it is actually needed",
          "Loading all assets upfront for faster repeat visits",
          "Avoiding modules larger than 100 KB",
          "Caching API responses client-side",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does JavaScript's garbage collector do?",
        codeSnippet: "let obj = { data: 'big' };\nobj = null; // original object eligible for GC",
        correctAnswer: "Frees memory occupied by objects with no remaining references",
        explanation: "When no reference points to an object, the GC can reclaim its memory automatically.",
        xpReward: 30,
        options: [
          "Compresses unused variables",
          "Frees memory occupied by objects with no remaining references",
          "Removes unused imports at build time",
          "Schedules functions when memory is low",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `performance.now()` return?",
        codeSnippet: "const start = performance.now();\nheavyWork();\nconsole.log(performance.now() - start, 'ms');",
        correctAnswer: "A high-resolution timestamp in ms since the page started",
        explanation: "performance.now() provides sub-millisecond precision relative to navigation start, useful for profiling.",
        xpReward: 30,
        options: [
          "The current Unix timestamp in ms",
          "A high-resolution timestamp in ms since the page started",
          "Total CPU time used by the script",
          "Milliseconds since January 1, 1970",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Which closure pattern commonly causes memory leaks?",
        codeSnippet: "function attach(el) {\n  const bigData = getData();\n  el.onClick = () => process(bigData);\n}",
        correctAnswer: "A closure capturing a large variable stored on a long-lived object",
        explanation: "If the closure is attached to a long-lived element or global, the captured variable cannot be garbage-collected.",
        xpReward: 30,
        options: [
          "Closures that capture the global object",
          "A closure capturing a large variable stored on a long-lived object",
          "Arrow functions inside classes",
          "Closures that call themselves recursively",
        ],
      },
      {
        type: "CODE_FILL",
        prompt: "Fill in the function used to schedule `fn` after the delay in this debounce implementation.",
        codeSnippet: "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = ___(fn, delay);\n  };\n}",
        correctAnswer: "setTimeout",
        explanation: "debounce clears any existing timer and sets a new one with setTimeout so fn fires only after the quiet period.",
        xpReward: 30,
        options: ["setTimeout", "setInterval", "requestAnimationFrame", "Promise.resolve"],
      },
    ],
  }, order);
}
