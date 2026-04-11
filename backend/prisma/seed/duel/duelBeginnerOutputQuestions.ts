/**
 * Duel question batch for Prisma seeding (duelBeginnerOutputQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

export function buildBeginnerOutputQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 20 }).map((_, index) => ({
    questionText: `Beginner Output ${index + 1}: What is the output?`,
    codeSnippet:
      index % 5 === 0
        ? "const x = 2;\nconsole.log(x + 3);"
        : index % 5 === 1
          ? "let name = 'JS';\nconsole.log(name.toLowerCase());"
          : index % 5 === 2
            ? "const arr = [1,2,3];\nconsole.log(arr.length);"
            : index % 5 === 3
              ? "console.log(Boolean(''));"
              : "const a = '5';\nconsole.log(Number(a) + 1);",
    correctAnswer:
      index % 5 === 0
        ? "5"
        : index % 5 === 1
          ? "js"
          : index % 5 === 2
            ? "3"
            : index % 5 === 3
              ? "false"
              : "6",
    options:
      index % 5 === 0
        ? ["4", "5", "23", "undefined"]
        : index % 5 === 1
          ? ["JS", "js", "undefined", "TypeError"]
          : index % 5 === 2
            ? ["2", "3", "4", "undefined"]
            : index % 5 === 3
              ? ["true", "false", "''", "0"]
              : ["51", "6", "NaN", "undefined"],
    explanation: "Read the operator behavior and method result directly from the snippet.",
    type: "MULTIPLE_CHOICE",
    difficulty: "JUNIOR",
    category: "OUTPUT",
  }))
}
