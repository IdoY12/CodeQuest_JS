/**
 * Seeds curriculum lesson block 02 — Junior track, Operators & Loops.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_02(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Junior track",
    title: "Operators, conditionals, and loops",
    description: "Comparisons, if/else, for and while loops, break and continue",
    estimatedMinutes: 12,
    orderIndex: 2,
    difficulty: "JUNIOR",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `===` check that `==` does not?",
        codeSnippet: "console.log(1 === '1');",
        correctAnswer: "Type and value",
        explanation: "=== (strict equality) checks both value and type without coercion.",
        xpReward: 20,
        options: ["Value only", "Type and value", "Reference equality", "Object identity"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `console.log(1 == '1')` output?",
        codeSnippet: "console.log(1 == '1');",
        correctAnswer: "true",
        explanation: "== performs type coercion, converting the string '1' to the number 1 before comparing.",
        xpReward: 20,
        options: ["true", "false", "TypeError", "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `!false` evaluate to?",
        codeSnippet: "console.log(!false);",
        correctAnswer: "true",
        explanation: "The ! operator inverts a boolean; !false is true.",
        xpReward: 20,
        options: ["false", "true", "null", "0"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does this ternary evaluate to?",
        codeSnippet: "const result = 10 > 3 ? 'yes' : 'no';",
        correctAnswer: '"yes"',
        explanation: "10 > 3 is true, so the ternary returns the first branch.",
        xpReward: 20,
        options: ['"yes"', '"no"', "true", "undefined"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "How many times does this loop run?",
        codeSnippet: "for (let i = 0; i < 4; i++) { }",
        correctAnswer: "4",
        explanation: "i starts at 0 and runs while i < 4, executing for i = 0, 1, 2, 3 — four times.",
        xpReward: 20,
        options: ["3", "4", "5", "infinite"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `break` do inside a loop?",
        codeSnippet: "for (let i = 0; i < 10; i++) {\n  if (i === 3) break;\n}",
        correctAnswer: "Exits the loop immediately",
        explanation: "break terminates the enclosing loop immediately.",
        xpReward: 20,
        options: ["Skips to the next iteration", "Exits the loop immediately", "Restarts the loop", "Pauses execution"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `continue` do inside a loop?",
        codeSnippet: "for (let i = 0; i < 5; i++) {\n  if (i === 2) continue;\n  console.log(i);\n}",
        correctAnswer: "Skips to the next iteration",
        explanation: "continue skips the rest of the current iteration body and moves to the next one.",
        xpReward: 20,
        options: ["Exits the loop", "Skips to the next iteration", "Restarts from the beginning", "Throws an error"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `&&` return when the left operand is falsy?",
        codeSnippet: "console.log(0 && 'hello');",
        correctAnswer: "The left operand",
        explanation: "&& short-circuits and returns the first falsy value it encounters.",
        xpReward: 20,
        options: ["true", "false", "The left operand", "The right operand"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the final value of x?",
        codeSnippet: "let x = 0;\nwhile (x < 5) { x++; }\nconsole.log(x);",
        correctAnswer: "5",
        explanation: "The loop increments x until x equals 5, at which point x < 5 becomes false.",
        xpReward: 20,
        options: ["4", "5", "6", "0"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `||` return when the left operand is truthy?",
        codeSnippet: "console.log('hello' || 'world');",
        correctAnswer: "The left operand",
        explanation: "|| short-circuits and returns the first truthy value it encounters.",
        xpReward: 20,
        options: ["The left operand", "The right operand", "true", "false"],
      },
    ],
  }, order);
}
