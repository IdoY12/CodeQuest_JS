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

export async function seedLessonBlock_14(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "ES6 Classes",
      title: "Classes and Inheritance",
      description: "Constructors, instances, and extending behavior",
      estimatedMinutes: 10,
      orderIndex: 1,
      difficulty: "SENIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "class User { constructor(name){ this.name = name; } }\nconst u = new User('Sam');\nconsole.log(u.name);",
          correctAnswer: "Sam",
          explanation: "Constructor assigns the name property on instance creation.",
          xpReward: 25,
          options: ["User", "Sam", "undefined", "name"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does extends do?",
          codeSnippet: "class Admin extends User {}",
          correctAnswer: "Creates a subclass that inherits User behavior",
          explanation: "extends links prototype inheritance between classes.",
          xpReward: 25,
          options: [
            "Creates a subclass that inherits User behavior",
            "Copies User values once only",
            "Runs User constructor automatically without super",
            "Disables methods",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this print?",
          codeSnippet: "class A { hi(){ return 'A'; } }\nclass B extends A { hi(){ return super.hi() + 'B'; } }\nconsole.log(new B().hi());",
          correctAnswer: "AB",
          explanation: "super.hi() calls the parent method, then appends B.",
          xpReward: 25,
          options: ["A", "B", "AB", "BA"],
        },
      ],
    }, order);
}
