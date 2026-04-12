/**
 * Seeds curriculum lesson block 09 — Senior track, Concurrency & Advanced Patterns.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_09(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Senior track",
    title: "Concurrency and advanced patterns",
    description: "Promise combinators, generators, Symbol, Proxy, currying, and Reflect",
    estimatedMinutes: 16,
    orderIndex: 3,
    difficulty: "SENIOR",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Promise.all([p1, p2, p3])` do?",
        codeSnippet: "const [a, b] = await Promise.all([fetchA(), fetchB()]);",
        correctAnswer: "Resolves when all resolve, or rejects as soon as any rejects",
        explanation: "Promise.all is all-or-nothing: it waits for everyone to resolve but fails fast if any single promise rejects.",
        xpReward: 30,
        options: [
          "Runs promises sequentially and returns the last result",
          "Resolves when all resolve, or rejects as soon as any rejects",
          "Resolves when at least one promise resolves",
          "Always resolves even if promises reject",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Promise.race([p1, p2])` return?",
        codeSnippet: "const result = await Promise.race([fast(), slow()]);",
        correctAnswer: "The result of the first promise to settle (resolve or reject)",
        explanation: "Promise.race settles as soon as any input promise settles — whether that means resolving or rejecting.",
        xpReward: 30,
        options: [
          "An array of the two fastest results",
          "The result of the first promise to settle (resolve or reject)",
          "The result of all promises combined",
          "The slowest promise's result",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "How does `Promise.allSettled` differ from `Promise.all`?",
        codeSnippet: "const results = await Promise.allSettled([fetch('/a'), fetch('/b')]);",
        correctAnswer: "allSettled waits for all promises regardless of rejection",
        explanation: "allSettled never rejects — it returns an array of {status, value/reason} for every input promise.",
        xpReward: 30,
        options: [
          "allSettled runs promises in series; all runs them in parallel",
          "allSettled waits for all promises regardless of rejection",
          "allSettled ignores resolved promises",
          "allSettled only works with async functions",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What makes a generator function unique?",
        codeSnippet: "function* count() { yield 1; yield 2; yield 3; }\nconst g = count();\nconsole.log(g.next().value); // 1",
        correctAnswer: "It can pause execution and yield multiple values over time",
        explanation: "Generator functions use function* and yield to produce a sequence of values, pausing between each yield.",
        xpReward: 30,
        options: [
          "It always runs asynchronously",
          "It can pause execution and yield multiple values over time",
          "It can only be called once",
          "It returns a Promise automatically",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Symbol('id')` guarantee?",
        codeSnippet: "const a = Symbol('id');\nconst b = Symbol('id');\nconsole.log(a === b); // false",
        correctAnswer: "Every call produces a unique value, even with the same description",
        explanation: "Symbols are unique primitives — two Symbols with the same description are never equal to each other.",
        xpReward: 30,
        options: [
          "The value is a string prefixed with 'id'",
          "Every call produces a unique value, even with the same description",
          "The symbol can be serialised to JSON",
          "The value is shared globally by default",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does a `Proxy` object intercept?",
        codeSnippet: "const p = new Proxy(target, {\n  get(obj, key) { return key in obj ? obj[key] : 'default'; }\n});",
        correctAnswer: "Fundamental operations on an object (get, set, delete, etc.) via traps",
        explanation: "A Proxy wraps an object and intercepts fundamental operations through named handler traps.",
        xpReward: 30,
        options: [
          "Only method calls on an object",
          "Network requests made by the object",
          "Fundamental operations on an object (get, set, delete, etc.) via traps",
          "Only prototype chain lookups",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is currying?",
        codeSnippet: "const add = a => b => a + b;\nconsole.log(add(2)(3)); // 5",
        correctAnswer: "Transforming a multi-argument function into a chain of single-argument functions",
        explanation: "A curried function takes one argument at a time, returning a new function for each until all arguments are supplied.",
        xpReward: 30,
        options: [
          "Chaining .then() calls on a Promise",
          "Memoizing a function's results",
          "Transforming a multi-argument function into a chain of single-argument functions",
          "Combining two functions into one",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is partial application?",
        codeSnippet: "const multiply = (a, b) => a * b;\nconst double = multiply.bind(null, 2);\nconsole.log(double(5)); // 10",
        correctAnswer: "Pre-filling some arguments to produce a specialised function with fewer parameters",
        explanation: "Partial application fixes some of a function's arguments, returning a new function that requires only the remaining ones.",
        xpReward: 30,
        options: [
          "Calling a function with fewer arguments than declared",
          "Pre-filling some arguments to produce a specialised function with fewer parameters",
          "Breaking a large function into smaller ones",
          "Applying a function to part of an array",
        ],
      },
      {
        type: "CODE_FILL",
        prompt: "Fill in the keyword that pauses the generator and emits a value.",
        codeSnippet: "function* range(start, end) {\n  for (let i = start; i < end; i++) {\n    ___ i;\n  }\n}",
        correctAnswer: "yield",
        explanation: "yield pauses the generator and returns the value to the caller; the next .next() call resumes from after the yield.",
        xpReward: 30,
        options: ["yield", "return", "await", "emit"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Reflect.ownKeys(obj)` return that `Object.keys(obj)` does not?",
        codeSnippet: "const s = Symbol('x');\nconst obj = { [s]: 1, a: 2 };\nconsole.log(Reflect.ownKeys(obj)); // [Symbol(x), 'a']",
        correctAnswer: "Symbol-keyed and non-enumerable string-keyed properties",
        explanation: "Reflect.ownKeys returns all own keys including Symbols and non-enumerable ones. Object.keys returns only own enumerable string keys.",
        xpReward: 30,
        options: [
          "Inherited enumerable properties",
          "Symbol-keyed and non-enumerable string-keyed properties",
          "Only prototype chain keys",
          "A live view of the object's properties",
        ],
      },
    ],
  }, order);
}
