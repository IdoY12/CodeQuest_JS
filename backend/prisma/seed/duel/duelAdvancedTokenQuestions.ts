/**
 * Duel question batch for Prisma seeding (duelAdvancedTokenQuestions).
 *
 * Responsibility: synthetic duel questions for one difficulty band.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

type QuestionTemplate = Pick<Prisma.DuelQuestionCreateManyInput, "codeSnippet" | "correctAnswer" | "options">;

const TEMPLATES: QuestionTemplate[] = [
  {
    codeSnippet: "const { a, ...rest } = obj;\nconsole.log(Object.___(rest).length);",
    correctAnswer: "keys",
    options: ["keys", "values", "entries", "assign"],
  },
  {
    codeSnippet: "router.get('/users', auth, ___);",
    correctAnswer: "handler",
    options: ["handler", "middleware", "listen", "post"],
  },
  {
    codeSnippet: "const result = await Promise.___([a(), b()]);",
    correctAnswer: "all",
    options: ["all", "race", "resolve", "any"],
  },
  {
    codeSnippet: "const value = config?.service?.port ___ 3000;",
    correctAnswer: "??",
    options: ["??", "&&", "||", "==="],
  },
];

export function buildAdvancedTokenQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 8 }).map((_, i) => ({
    questionText: `Advanced Token ${i + 1}: Complete the snippet.`,
    ...TEMPLATES[i % TEMPLATES.length],
    explanation: "Token completion checks production API familiarity and modern syntax.",
    type: "MCQ",
    difficulty: "SENIOR",
  }));
}
