/**
 * Duel question batch for Prisma seeding (duelBeginnerTokenQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

export function buildBeginnerTokenQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 8 }).map((_, index) => ({
    questionText: `Beginner Token ${index + 1}: Pick the correct token.`,
    codeSnippet:
      index % 4 === 0
        ? "const nums = [1,2,3];\nconst result = nums.___(n => n * 2);"
        : index % 4 === 1
          ? "const name = 'codequest';\nconsole.log(name.___());"
          : index % 4 === 2
            ? "const flag = true;\nif (flag ___ false) {\n  console.log('ok');\n}"
            : "const x = 4;\nconsole.log(___ x);",
    correctAnswer: index % 4 === 0 ? "map" : index % 4 === 1 ? "toUpperCase" : index % 4 === 2 ? "&&" : "typeof",
    options:
      index % 4 === 0
        ? ["map", "filter", "reduce", "forEach"]
        : index % 4 === 1
          ? ["trim", "toUpperCase", "slice", "repeat"]
          : index % 4 === 2
            ? ["&&", "=>", "||", "??"]
            : ["typeof", "return", "delete", "await"],
    explanation: "Choose the token that makes the code valid and correct.",
    type: "TAP_TOKEN",
    difficulty: "JUNIOR",
    category: "TYPES",
  }))
}
