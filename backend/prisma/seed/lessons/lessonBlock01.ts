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

export async function seedLessonBlock_01(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "What JavaScript Is"),
      title: "JavaScript in the Browser",
      description: "Understand JS runtime and console basics",
      estimatedMinutes: 8,
      orderIndex: 1,
      difficulty: "BEGINNER",
      exercises: [
        {
          type: "CONCEPT_CARD",
          prompt: "JavaScript adds behavior to web pages.",
          codeSnippet: "console.log('Button clicked!');",
          correctAnswer: "GOT_IT",
          explanation: "JS reacts to user actions and changes what users see.",
          xpReward: 10,
        },
        {
          type: "CONCEPT_CARD",
          prompt: "Use the browser console to inspect values quickly.",
          codeSnippet: "const score = 42;\nconsole.log(score);",
          correctAnswer: "GOT_IT",
          explanation: "The console is your first debugging tool.",
          xpReward: 10,
        },
      ],
    });
}
