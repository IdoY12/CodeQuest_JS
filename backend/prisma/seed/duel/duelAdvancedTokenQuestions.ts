/**
 * Duel question batch for Prisma seeding (duelAdvancedTokenQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

export function buildAdvancedTokenQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 8 }).map((_, index) => ({
    questionText: `Advanced Token ${index + 1}: Complete the snippet.`,
    codeSnippet:
      index % 4 === 0
        ? "const { a, ...rest } = obj;\nconsole.log(Object.___(rest).length);"
        : index % 4 === 1
          ? "router.get('/users', auth, ___);"
          : index % 4 === 2
            ? "const result = await Promise.___([a(), b()]);"
            : "const value = config?.service?.port ___ 3000;",
    correctAnswer: index % 4 === 0 ? "keys" : index % 4 === 1 ? "handler" : index % 4 === 2 ? "all" : "??",
    options:
      index % 4 === 0
        ? ["keys", "values", "entries", "assign"]
        : index % 4 === 1
          ? ["handler", "middleware", "listen", "post"]
          : index % 4 === 2
            ? ["all", "race", "resolve", "any"]
            : ["??", "&&", "||", "==="],
    explanation: "Token completion checks production API familiarity and modern syntax.",
    type: "TAP_TOKEN",
    difficulty: "ADVANCED",
    category: "METHODS",
    timesUsed: 0,
    correctRate: 1,
  }))
}
