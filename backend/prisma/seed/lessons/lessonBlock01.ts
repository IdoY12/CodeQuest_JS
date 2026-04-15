/**
 * Seeds curriculum lesson block 01 — Junior track, Variables & Types.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_01(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Junior track",
    title: "Variables, values, and types",
    description: "let/const, reassignment, typeof basics, and type coercion",
    estimatedMinutes: 12,
    orderIndex: 1,
    difficulty: "JUNIOR",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `typeof null` return?",
        codeSnippet: "console.log(typeof null);",
        correctAnswer: '"object"',
        explanation: "A historical JavaScript bug — typeof null returns 'object', not 'null'.",
        options: ['"null"', '"object"', '"undefined"', '"boolean"'],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Which keyword allows a variable to be reassigned after declaration?",
        codeSnippet: "// choose the correct keyword",
        correctAnswer: "let",
        explanation: "let allows reassignment. const does not allow the binding to be reassigned.",
        options: ["const", "let", "final", "immutable"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Boolean(\"\")` return?",
        codeSnippet: 'console.log(Boolean(""));',
        correctAnswer: "false",
        explanation: "An empty string is one of JavaScript's falsy values.",
        options: ["true", "false", "null", "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the output?",
        codeSnippet: "let score = 100;\nconsole.log(typeof score);",
        correctAnswer: '"number"',
        explanation: "The number literal 100 has type 'number'.",
        options: ['"string"', '"number"', '"integer"', '"boolean"'],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What happens when you try to reassign a const?",
        codeSnippet: "const MAX = 100;\nMAX = 200;",
        correctAnswer: "It throws a TypeError",
        explanation: "const bindings cannot be reassigned after initialisation.",
        options: ["MAX silently stays 100", "MAX becomes 200", "It throws a TypeError", "MAX becomes undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `typeof undefined` return?",
        codeSnippet: "console.log(typeof undefined);",
        correctAnswer: '"undefined"',
        explanation: "undefined is its own primitive type with the type string 'undefined'.",
        options: ['"null"', '"void"', '"undefined"', '"object"'],
      },
      {
        type: "TAP_TOKEN",
        prompt: "Tap the value that is falsy.",
        codeSnippet: 'const candidates = [0, "false", 1, true];',
        correctAnswer: "0",
        explanation: '0 is falsy. The string "false" is a non-empty string and therefore truthy.',
        options: ["0", '"false"', "1", "true"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the result?",
        codeSnippet: 'console.log(1 + "2");',
        correctAnswer: '"12"',
        explanation: "When + has a string operand, the other operand is coerced to a string and concatenated.",
        options: ["3", '"12"', "NaN", "TypeError"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `typeof true` return?",
        codeSnippet: "console.log(typeof true);",
        correctAnswer: '"boolean"',
        explanation: "Boolean values have the primitive type 'boolean'.",
        options: ['"boolean"', '"string"', '"number"', '"bool"'],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is logged?",
        codeSnippet: "let a = 5;\nlet b = a;\nb = 10;\nconsole.log(a);",
        correctAnswer: "5",
        explanation: "Primitives are copied by value. Reassigning b does not affect a.",
        options: ["5", "10", "undefined", "null"],
      },
    ],
  }, order);
}
