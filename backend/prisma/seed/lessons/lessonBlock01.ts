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

export async function seedLessonBlock_01(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Junior track",
      title: "Variables, values, and types",
      description: "let/const, reassignment, and typeof basics",
      estimatedMinutes: 12,
      orderIndex: 1,
      difficulty: "JUNIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "let name = 'Maya';\nconsole.log(name);",
          correctAnswer: "Maya",
          explanation: "The variable name stores the string 'Maya'.",
          xpReward: 20,
          options: ["Maya", "name", "undefined", "null"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "Which declaration should be used for values that should not be reassigned?",
          codeSnippet: "// choose one keyword",
          correctAnswer: "const",
          explanation: "Use const when the variable binding should stay fixed.",
          xpReward: 20,
          options: ["let", "const", "var", "value"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What happens here?",
          codeSnippet: "const points = 10;\npoints = 12;",
          correctAnswer: "It throws an error",
          explanation: "A const binding cannot be reassigned.",
          xpReward: 20,
          options: ["It updates to 12", "It throws an error", "It becomes undefined", "It prints 10"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "let city = 'Paris';\ncity = 'Rome';\nconsole.log(city);",
          correctAnswer: "Rome",
          explanation: "let allows reassignment, so the latest value is logged.",
          xpReward: 20,
          options: ["Paris", "Rome", "undefined", "city"],
        },
        {
          type: "CODE_FILL",
          prompt: "Fill the blank with the correct variable name.",
          codeSnippet: "let user = 'Ana';\nconsole.log(___);",
          correctAnswer: "user",
          explanation: "You print a variable by writing its identifier.",
          xpReward: 20,
          options: ["user", "const", "let", "username"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "console.log(typeof '5');",
          correctAnswer: "string",
          explanation: "Quotes make 5 a string value.",
          xpReward: 20,
          options: ["number", "string", "boolean", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the result?",
          codeSnippet: "console.log(typeof 5);",
          correctAnswer: "number",
          explanation: "Without quotes, 5 is a number.",
          xpReward: 20,
          options: ["string", "number", "boolean", "object"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the value that is falsy.",
          codeSnippet: "const candidates = [0, 'hello', 9, true];",
          correctAnswer: "0",
          explanation: "0 is one of JavaScript's falsy values.",
          xpReward: 20,
          options: ["0", "'hello'", "9", "true"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the value whose typeof is 'undefined'.",
          codeSnippet: "const value = undefined;\nconsole.log(typeof value);",
          correctAnswer: "undefined",
          explanation: "The literal undefined has typeof 'undefined'.",
          xpReward: 20,
          options: ["null", "undefined", "false", "0"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const a = 1;\nconst b = '1';\nconsole.log(a + b);",
          correctAnswer: "'11'",
          explanation: "The number is coerced to string when concatenating with +.",
          xpReward: 20,
          options: ["2", "'11'", "11", "NaN"],
        },
      ],
    },
    order);
}
