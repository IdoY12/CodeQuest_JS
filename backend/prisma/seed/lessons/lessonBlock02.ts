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

export async function seedLessonBlock_02(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "Variables and Values"),
      title: "Storing and Reusing Values",
      description: "Work with let/const and variable reassignment",
      estimatedMinutes: 12,
      orderIndex: 1,
      difficulty: "BEGINNER",
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
      ],
    });
}
