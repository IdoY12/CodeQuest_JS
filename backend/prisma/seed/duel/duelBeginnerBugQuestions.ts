/**
 * Duel question batch for Prisma seeding (duelBeginnerBugQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

export function buildBeginnerBugQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 12 }).map((_, index) => ({
    questionText: `Beginner Bug ${index + 1}: Which line contains the bug?`,
    codeSnippet:
      index % 4 === 0
        ? "const total = 0;\nfor (let i = 0; i <= 3; i++) {\n  total += i;\n}"
        : index % 4 === 1
          ? "const score = 10;\nif (score = 10) {\n  console.log('Perfect');\n}"
          : index % 4 === 2
            ? "const user = { name: 'Ada' };\nconsole.log(user.age.toUpperCase());\nconsole.log('done');\nconst safe = true;"
            : "const values = [1,2,3];\nconsole.log(values.length());\nconsole.log(values);\nconst done = true;",
    correctAnswer: index % 4 === 0 ? "1" : index % 4 === 1 ? "2" : index % 4 === 2 ? "2" : "2",
    options: ["1", "2", "3", "4"],
    explanation: "Spot the line that introduces invalid logic or runtime behavior.",
    type: "FIND_THE_BUG",
    difficulty: "JUNIOR",
    category: "METHODS",
  }))
}
