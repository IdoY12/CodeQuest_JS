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

export async function seedLessonBlock_02(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Junior track",
      title: "Operators, conditionals, and loops",
      description: "Comparisons, if/else, for and while",
      estimatedMinutes: 12,
      orderIndex: 2,
      difficulty: "JUNIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "console.log(6 / 2 + 1);",
          correctAnswer: "4",
          explanation: "6 / 2 is 3, then +1 gives 4.",
          xpReward: 20,
          options: ["3", "4", "7", "12"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does strict equality return?",
          codeSnippet: "console.log(5 === '5');",
          correctAnswer: "false",
          explanation: "=== checks both value and type.",
          xpReward: 20,
          options: ["true", "false", "5", "'5'"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is printed?",
          codeSnippet: "const isMember = true;\nif (isMember) { console.log('Access'); } else { console.log('Denied'); }",
          correctAnswer: "Access",
          explanation: "The if branch runs when condition is true.",
          xpReward: 20,
          options: ["Denied", "Access", "Both", "Nothing"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "const age = 15;\nif (age >= 18) { console.log('Adult'); } else { console.log('Minor'); }",
          correctAnswer: "Minor",
          explanation: "15 is not greater than or equal to 18.",
          xpReward: 20,
          options: ["Adult", "Minor", "undefined", "false"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What value is assigned?",
          codeSnippet: "const online = false;\nconst status = online ? 'On' : 'Off';\nconsole.log(status);",
          correctAnswer: "Off",
          explanation: "Ternary chooses the second value when condition is false.",
          xpReward: 20,
          options: ["On", "Off", "false", "status"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "How many times does this loop run?",
          codeSnippet: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
          correctAnswer: "5",
          explanation: "It runs for i = 1,2,3,4,5.",
          xpReward: 20,
          options: ["4", "5", "6", "1"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is printed?",
          codeSnippet: "let n = 1;\nwhile (n < 4) {\n  console.log(n);\n  n++;\n}",
          correctAnswer: "1, 2, 3",
          explanation: "The loop prints each value before incrementing until n becomes 4.",
          xpReward: 20,
          options: ["1, 2, 3", "1, 2, 3, 4", "2, 3, 4", "1"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `continue` do inside a `for` loop?",
          codeSnippet: "for (let i = 0; i < 3; i++) {\n  if (i === 1) continue;\n  console.log(i);\n}",
          correctAnswer: "Skips the rest of the current iteration",
          explanation: "`continue` jumps to the next iteration without finishing the loop body.",
          xpReward: 20,
          options: [
            "Exits the loop entirely",
            "Skips the rest of the current iteration",
            "Restarts from i = 0",
            "Throws an error",
          ],
        },
        {
          type: "CODE_FILL",
          prompt: "Fill the blank with the keyword that exits a loop early.",
          codeSnippet: "for (let i = 0; i < 10; i++) {\n  if (i === 4) ___;\n}",
          correctAnswer: "break",
          explanation: "`break` leaves the nearest enclosing loop.",
          xpReward: 20,
          options: ["break", "continue", "return", "stop"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "let sum = 0;\nfor (const n of [2, 3]) {\n  sum += n;\n}\nconsole.log(sum);",
          correctAnswer: "5",
          explanation: "`for...of` visits each value; 2 + 3 equals 5.",
          xpReward: 20,
          options: ["0", "5", "23", "6"],
        },
      ],
    }, order);
}
