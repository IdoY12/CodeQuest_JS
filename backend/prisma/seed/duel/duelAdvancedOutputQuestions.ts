/**
 * Duel question batch for Prisma seeding (duelAdvancedOutputQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

export function buildAdvancedOutputQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 20 }).map((_, index) => ({
    questionText: `Advanced Output ${index + 1}: What prints first / final value?`,
    codeSnippet:
      index % 5 === 0
        ? "Promise.resolve().then(() => console.log('micro'));\nsetTimeout(() => console.log('macro'), 0);\nconsole.log('sync');"
        : index % 5 === 1
          ? "const obj = { x: 2, fn() { return this.x; } };\nconst f = obj.fn;\nconsole.log(f());"
          : index % 5 === 2
            ? "const a = [1,2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);"
            : index % 5 === 3
              ? "async function run(){ return 7; }\nrun().then(v => console.log(v));\nconsole.log('after');"
              : "const map = new Map();\nmap.set('x', 1);\nconsole.log(map.get('x'));",
    correctAnswer:
      index % 5 === 0
        ? "sync, micro, macro"
        : index % 5 === 1
          ? "undefined"
          : index % 5 === 2
            ? "3"
            : index % 5 === 3
              ? "after, 7"
              : "1",
    options:
      index % 5 === 0
        ? ["micro, sync, macro", "sync, micro, macro", "sync, macro, micro", "macro, sync, micro"]
        : index % 5 === 1
          ? ["2", "undefined", "null", "TypeError"]
          : index % 5 === 2
            ? ["2", "3", "1", "4"]
            : index % 5 === 3
              ? ["7, after", "after, 7", "after only", "Promise pending"]
              : ["0", "1", "undefined", "NaN"],
    explanation: "Advanced questions test event loop order, this binding, and references.",
    type: "MULTIPLE_CHOICE",
    difficulty: "ADVANCED",
    category: "ASYNC",
    timesUsed: 0,
    correctRate: 1,
  }))
}
