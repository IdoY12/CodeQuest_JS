/**
 * Duel question batch for Prisma seeding (duelBeginnerBugQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

type QuestionTemplate = Pick<Prisma.DuelQuestionCreateManyInput, "codeSnippet" | "correctAnswer">;

const TEMPLATES: QuestionTemplate[] = [
  {
    codeSnippet: "const total = 0;\nfor (let i = 0; i <= 3; i++) {\n  total += i;\n}",
    correctAnswer: "1",
  },
  {
    codeSnippet: "const score = 10;\nif (score = 10) {\n  console.log('Perfect');\n}",
    correctAnswer: "2",
  },
  {
    codeSnippet: "const user = { name: 'Ada' };\nconsole.log(user.age.toUpperCase());\nconsole.log('done');\nconst safe = true;",
    correctAnswer: "2",
  },
  {
    codeSnippet: "const values = [1,2,3];\nconsole.log(values.length());\nconsole.log(values);\nconst done = true;",
    correctAnswer: "2",
  },
];

export function buildBeginnerBugQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    questionText: `Beginner Bug ${i + 1}: Which line contains the bug?`,
    ...TEMPLATES[i % TEMPLATES.length],
    options: ["1", "2", "3", "4"],
    explanation: "Spot the line that introduces invalid logic or runtime behavior.",
    type: "FIND_THE_BUG",
    difficulty: "JUNIOR",
    category: "METHODS",
  }));
}
