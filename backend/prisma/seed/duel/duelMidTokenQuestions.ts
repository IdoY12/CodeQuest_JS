/**
 * Duel question batch for Prisma seeding (MID / intermediate token completion).
 *
 * Responsibility: TAP_TOKEN style prompts between beginner and advanced depth.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

type QuestionTemplate = Pick<Prisma.DuelQuestionCreateManyInput, "codeSnippet" | "correctAnswer" | "options">;

const TEMPLATES: QuestionTemplate[] = [
  {
    codeSnippet: "const ids = [1, 2, 2, 3];\nconst unique = [...new ___ (ids)];",
    correctAnswer: "Set",
    options: ["Set", "Map", "WeakSet", "Array"],
  },
  {
    codeSnippet: "const delay = (ms) => new ___((resolve) => setTimeout(resolve, ms));",
    correctAnswer: "Promise",
    options: ["Promise", "setTimeout", "async", "requestAnimationFrame"],
  },
  {
    codeSnippet: "const cfg = { host: 'localhost' };\nconst host = cfg.host ___ '127.0.0.1';",
    correctAnswer: "??",
    options: ["??", "||", "&&", "?."],
  },
  {
    codeSnippet: "const nums = [1, 2, 3];\nconst last = nums.___(-1);",
    correctAnswer: "at",
    options: ["at", "slice", "pop", "find"],
  },
];

export function buildMidTokenQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 8 }).map((_, i) => ({
    questionText: `Mid Token ${i + 1}: Pick the correct token.`,
    ...TEMPLATES[i % TEMPLATES.length],
    explanation: "Intermediate: collections, promises, nullish coalescing, and modern array helpers.",
    type: "TAP_TOKEN",
    difficulty: "MID",
  }));
}
