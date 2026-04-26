/**
 * Duel question batch for Prisma seeding (duelBeginnerOutputQuestions).
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
    codeSnippet: "const x = 2;\nconsole.log(x + 3);",
    correctAnswer: "5",
    options: ["4", "5", "23", "undefined"],
  },
  {
    codeSnippet: "let name = 'JS';\nconsole.log(name.toLowerCase());",
    correctAnswer: "js",
    options: ["JS", "js", "undefined", "TypeError"],
  },
  {
    codeSnippet: "const arr = [1,2,3];\nconsole.log(arr.length);",
    correctAnswer: "3",
    options: ["2", "3", "4", "undefined"],
  },
  {
    codeSnippet: "console.log(Boolean(''));",
    correctAnswer: "false",
    options: ["true", "false", "''", "0"],
  },
  {
    codeSnippet: "const a = '5';\nconsole.log(Number(a) + 1);",
    correctAnswer: "6",
    options: ["51", "6", "NaN", "undefined"],
  },
];

export function buildBeginnerOutputQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 20 }).map((_, i) => ({
    questionText: `Beginner Output ${i + 1}: What is the output?`,
    ...TEMPLATES[i % TEMPLATES.length],
    explanation: "Read the operator behavior and method result directly from the snippet.",
    type: "MCQ",
    difficulty: "JUNIOR",
  }));
}
