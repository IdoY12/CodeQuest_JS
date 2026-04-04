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
import { requireChapterId } from "../lib/requireChapterId.js";

export async function seedLessonBlock_07(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Functions"),
      title: "Functions and Return Values",
      description: "Declare, call, and reason about returned data",
      estimatedMinutes: 12,
      orderIndex: 1,
      difficulty: "BEGINNER",
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
      ],
    });
}
