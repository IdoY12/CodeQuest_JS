/**
 * Duel question batch for Prisma seeding (duelBeginnerTokenQuestions).
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
    codeSnippet: "const nums = [1,2,3];\nconst result = nums.___(n => n * 2);",
    correctAnswer: "map",
    options: ["map", "filter", "reduce", "forEach"],
  },
  {
    codeSnippet: "const name = 'codequest';\nconsole.log(name.___());",
    correctAnswer: "toUpperCase",
    options: ["trim", "toUpperCase", "slice", "repeat"],
  },
  {
    codeSnippet: "const flag = true;\nif (flag ___ false) {\n  console.log('ok');\n}",
    correctAnswer: "&&",
    options: ["&&", "=>", "||", "??"],
  },
  {
    codeSnippet: "const x = 4;\nconsole.log(___ x);",
    correctAnswer: "typeof",
    options: ["typeof", "return", "delete", "await"],
  },
];

export function buildBeginnerTokenQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 8 }).map((_, i) => ({
    questionText: `Beginner Token ${i + 1}: Pick the correct token.`,
    ...TEMPLATES[i % TEMPLATES.length],
    explanation: "Choose the token that makes the code valid and correct.",
    type: "MCQ",
    difficulty: "JUNIOR",
  }));
}
