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

export async function seedLessonBlock_03(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Junior track",
      title: "Functions and array basics",
      description: "Declare functions, return values, and use arrays",
      estimatedMinutes: 12,
      orderIndex: 3,
      difficulty: "JUNIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What gets logged?",
          codeSnippet: "function greet() { return 'Hi'; }\nconsole.log(greet());",
          correctAnswer: "Hi",
          explanation: "greet returns 'Hi', and console.log prints it.",
          xpReward: 20,
          options: ["greet", "Hi", "undefined", "function"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the difference here?",
          codeSnippet: "function say(){ console.log('Hi'); }\nfunction get(){ return 'Hi'; }",
          correctAnswer: "say logs directly, get returns a value",
          explanation: "console.log outputs immediately; return passes a value to the caller.",
          xpReward: 20,
          options: [
            "Both return strings",
            "say logs directly, get returns a value",
            "Both throw errors",
            "get logs directly, say returns value",
          ],
        },
        {
          type: "DRAG_DROP",
          prompt: "Arrange the lines to build a valid function that returns a full name.",
          codeSnippet: "function fullName(first, last) {\nreturn `${first} ${last}`;\n}\nconsole.log(fullName('Ada', 'Lovelace'));",
          correctAnswer: "function fullName(first, last) {||return `${first} ${last}`;||}||console.log(fullName('Ada', 'Lovelace'));",
          explanation: "The function declaration must wrap the return statement before calling it.",
          xpReward: 25,
        },
        {
          type: "CODE_FILL",
          prompt: "Fill the blank with the keyword that sends a value back.",
          codeSnippet: "function add(a, b) {\n  /* blank */\n  a + b;\n}",
          correctAnswer: "return",
          explanation: "return sends a value back to whoever called the function.",
          xpReward: 20,
          options: ["return", "console.log", "let", "const"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const triple = (n) => n * 3;\nconsole.log(triple(4));",
          correctAnswer: "12",
          explanation: "Arrow functions can return an expression without braces.",
          xpReward: 20,
          options: ["4", "12", "7", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What happens if a function has no `return`?",
          codeSnippet: "function f() { 1 + 1; }\nconsole.log(f());",
          correctAnswer: "It returns undefined",
          explanation: "Without an explicit return, the call result is undefined.",
          xpReward: 20,
          options: ["It returns 2", "It returns undefined", "It throws", "It returns null"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const colors = ['red', 'blue', 'green'];\nconsole.log(colors[1]);",
          correctAnswer: "blue",
          explanation: "Array indexes start at 0, so index 1 is 'blue'.",
          xpReward: 20,
          options: ["red", "blue", "green", "undefined"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "const nums = [4, 9, 16];\nconsole.log(nums.length);",
          correctAnswer: "3",
          explanation: ".length returns the number of elements in the array.",
          xpReward: 20,
          options: ["2", "3", "4", "16"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const xs = [10, 20];\nxs.push(30);\nconsole.log(xs[2]);",
          correctAnswer: "30",
          explanation: "`push` appends to the end; index 2 is the third element.",
          xpReward: 20,
          options: ["20", "30", "undefined", "10"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const nums = [1, 2, 3];\nconsole.log(nums.at(-1));",
          correctAnswer: "3",
          explanation: "Negative indices count from the end; -1 is the last element.",
          xpReward: 20,
          options: ["1", "2", "3", "undefined"],
        },
      ],
    }, order);
}
