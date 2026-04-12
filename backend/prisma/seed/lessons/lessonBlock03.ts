/**
 * Seeds curriculum lesson block 03 — Junior track, Functions & Arrays.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_03(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Junior track",
    title: "Functions and array basics",
    description: "Declarations vs expressions, arrow functions, and core array methods",
    estimatedMinutes: 12,
    orderIndex: 3,
    difficulty: "JUNIOR",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the key difference between a function declaration and a function expression?",
        codeSnippet: "// Declaration\nfunction greet() {}\n// Expression\nconst greet2 = function() {};",
        correctAnswer: "Declarations are hoisted; expressions are not",
        explanation: "Function declarations are hoisted so they can be called before they appear in source. Expressions are not.",
        xpReward: 20,
        options: [
          "Declarations are hoisted; expressions are not",
          "Expressions are always faster",
          "Declarations require a return statement",
          "There is no practical difference",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `arr.push(5)` do?",
        codeSnippet: "const arr = [1, 2, 3];\narr.push(5);",
        correctAnswer: "Adds 5 to the end of the array",
        explanation: "push appends the given value to the end of the array and returns the new length.",
        xpReward: 20,
        options: [
          "Adds 5 to the beginning",
          "Removes the last element",
          "Adds 5 to the end of the array",
          "Returns the element at index 5",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the output?",
        codeSnippet: "const double = n => n * 2;\nconsole.log(double(4));",
        correctAnswer: "8",
        explanation: "A concise arrow function implicitly returns the expression. 4 × 2 = 8.",
        xpReward: 20,
        options: ["4", "8", "2", "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does this return?",
        codeSnippet: "console.log([1, 2, 3, 4].filter(n => n > 2));",
        correctAnswer: "[3, 4]",
        explanation: "filter returns a new array containing only elements for which the callback returns true.",
        xpReward: 20,
        options: ["[1, 2]", "[3, 4]", "[2, 3, 4]", "[1]"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `arr.pop()` do?",
        codeSnippet: "const arr = [1, 2, 3];\nconst last = arr.pop();",
        correctAnswer: "Removes and returns the last element",
        explanation: "pop removes the last element from the array, mutates it, and returns the removed element.",
        xpReward: 20,
        options: [
          "Adds an element to the end",
          "Removes and returns the last element",
          "Removes and returns the first element",
          "Returns without removing",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `[1, 2, 3].map(n => n + 10)` return?",
        codeSnippet: "console.log([1, 2, 3].map(n => n + 10));",
        correctAnswer: "[11, 12, 13]",
        explanation: "map creates a new array by applying the callback to each element.",
        xpReward: 20,
        options: ["[1, 2, 3]", "[11, 12, 13]", "[10, 10, 10]", "[10, 11, 12]"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is `['a', 'b', 'c'][1]`?",
        codeSnippet: "console.log(['a', 'b', 'c'][1]);",
        correctAnswer: '"b"',
        explanation: "Arrays are zero-indexed, so index 1 is the second element.",
        xpReward: 20,
        options: ['"a"', '"b"', '"c"', "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `[5, 12, 3].find(n => n > 10)` return?",
        codeSnippet: "console.log([5, 12, 3].find(n => n > 10));",
        correctAnswer: "12",
        explanation: "find returns the first element that satisfies the condition — a single value, not an array.",
        xpReward: 20,
        options: ["[12]", "12", "3", "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is printed?",
        codeSnippet: "function noReturn() { }\nconsole.log(noReturn());",
        correctAnswer: "undefined",
        explanation: "A function without a return statement implicitly returns undefined.",
        xpReward: 20,
        options: ["null", "0", "undefined", "void"],
      },
      {
        type: "CODE_FILL",
        prompt: "Fill in the method name to add 'c' to the end of the array.",
        codeSnippet: "const items = ['a', 'b'];\nitems.___('c');",
        correctAnswer: "push",
        explanation: "push is the standard array method for appending one or more elements to the end.",
        xpReward: 20,
        options: ["push", "add", "append", "insert"],
      },
    ],
  }, order);
}
