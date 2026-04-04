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

export async function seedLessonBlock_11(prisma: PrismaClient, chapterByTitle: Map<string, string>): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterId: requireChapterId(chapterByTitle, "this Binding"),
      title: "Understanding this in Context",
      description: "Compare method, standalone, and arrow contexts",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "ADVANCED",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this method call return?",
          codeSnippet: "const obj = { x: 5, getX(){ return this.x; } };\nconsole.log(obj.getX());",
          correctAnswer: "5",
          explanation: "When called as obj.getX(), this points to obj.",
          xpReward: 25,
          options: ["undefined", "5", "obj", "NaN"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What happens here?",
          codeSnippet: "const obj = { x: 5, getX(){ return this.x; } };\nconst fn = obj.getX;\nconsole.log(fn());",
          correctAnswer: "undefined",
          explanation: "Detached function call loses the object receiver in strict mode patterns.",
          xpReward: 25,
          options: ["5", "undefined", "obj", "throws syntax error"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does an arrow function keep from outer scope?",
          codeSnippet: "const obj = { x: 9, run(){ const f = () => this.x; return f(); } };\nconsole.log(obj.run());",
          correctAnswer: "9",
          explanation: "Arrow functions capture surrounding this from run().",
          xpReward: 25,
          options: ["undefined", "9", "0", "NaN"],
        },
      ],
    });
}
