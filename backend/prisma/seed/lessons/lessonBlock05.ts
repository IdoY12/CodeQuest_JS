/**
 * Seeds curriculum lesson block 05 — Mid track, Collections & Patterns.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_05(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Mid track",
    title: "Maps, sets, and array patterns",
    description: "Map, Set, WeakMap, spread, rest, destructuring, and reduce",
    estimatedMinutes: 14,
    orderIndex: 2,
    difficulty: "MID",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does a `Map` preserve that a plain object does not?",
        codeSnippet: "const map = new Map();\nmap.set(1, 'one');\nmap.set('two', 2);",
        correctAnswer: "Insertion order for any key type",
        explanation: "Map preserves insertion order for all key types, including objects and numbers.",
        options: [
          "String-only key access",
          "Insertion order for any key type",
          "Prototype chain inheritance",
          "JSON serialisation support",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does a `Set` guarantee about its values?",
        codeSnippet: "const s = new Set([1, 2, 2, 3]);\nconsole.log(s.size);",
        correctAnswer: "Each value appears at most once",
        explanation: "A Set automatically discards duplicate values on insertion.",
        options: [
          "Values are sorted automatically",
          "Values are all the same type",
          "Each value appears at most once",
          "Values are immutable",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does the spread operator do in `Math.max(...[3, 1, 4])`?",
        codeSnippet: "console.log(Math.max(...[3, 1, 4]));",
        correctAnswer: "Expands the array into individual arguments",
        explanation: "... unpacks the array so Math.max receives three separate numeric arguments.",
        options: [
          "Creates a shallow copy of the array",
          "Expands the array into individual arguments",
          "Concatenates multiple arrays",
          "Converts the array to a string",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `const [a, b] = [10, 20]` do?",
        codeSnippet: "const [a, b] = [10, 20];\nconsole.log(a, b);",
        correctAnswer: "Assigns 10 to a and 20 to b",
        explanation: "Array destructuring unpacks values by position into the named variables.",
        options: [
          "Creates an array [a, b]",
          "Assigns 10 to a and 20 to b",
          "Checks if a equals 10",
          "Creates a tuple",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Array.from('hello')` return?",
        codeSnippet: "console.log(Array.from('hello'));",
        correctAnswer: "['h','e','l','l','o']",
        explanation: "Array.from iterates any iterable — here it splits the string into individual characters.",
        options: ["['hello']", "['h','e','l','l','o']", "5", "[104,101,108,108,111]"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `...args` collect in `function f(a, ...args)`?",
        codeSnippet: "function f(a, ...args) { console.log(args); }\nf(1, 2, 3, 4);",
        correctAnswer: "All arguments after a",
        explanation: "Rest parameters collect all remaining arguments into a real array, here [2, 3, 4].",
        options: [
          "All arguments including a",
          "All arguments after a",
          "Only the last argument",
          "The arguments object",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the result?",
        codeSnippet: "console.log([...new Set([1, 1, 2, 2, 3])]);",
        correctAnswer: "[1, 2, 3]",
        explanation: "new Set removes duplicates; spreading it back into an array gives the unique values.",
        options: ["[1, 2, 3]", "[1, 1, 2, 2, 3]", "Set(3)", "[3]"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `[1, 2, 3, 4].reduce((acc, n) => acc + n, 0)` return?",
        codeSnippet: "console.log([1, 2, 3, 4].reduce((acc, n) => acc + n, 0));",
        correctAnswer: "10",
        explanation: "reduce accumulates: starting from 0 it adds 1+2+3+4 = 10.",
        options: ["10", "24", "0", "[1, 2, 3, 4]"],
      },
      {
        type: "CODE_FILL",
        prompt: "Fill in the blank to destructure the `name` property from the object.",
        codeSnippet: "const user = { name: 'Sam', age: 25 };\nconst { ___ } = user;\nconsole.log(name);",
        correctAnswer: "name",
        explanation: "Object destructuring extracts a property using its key name.",
        options: ["name", "user.name", "'name'", "this.name"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What type of values must a `WeakMap` use as keys?",
        codeSnippet: "const wm = new WeakMap();\nwm.set({}, 'value');",
        correctAnswer: "Objects only",
        explanation: "WeakMap keys must be objects, allowing the garbage collector to reclaim keys with no other references.",
        options: ["Strings only", "Objects only", "Numbers and strings", "Any primitive"],
      },
    ],
  }, order);
}
