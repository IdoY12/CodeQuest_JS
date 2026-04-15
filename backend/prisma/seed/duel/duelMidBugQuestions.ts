/**
 * Duel question batch for Prisma seeding (MID / intermediate bug questions).
 *
 * Responsibility: line-level bug spotting harder than JUNIOR, lighter than SENIOR.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

type QuestionTemplate = Pick<Prisma.DuelQuestionCreateManyInput, "codeSnippet" | "correctAnswer">;

const TEMPLATES: QuestionTemplate[] = [
  {
    codeSnippet: "async function load() {\n  const res = await fetch('/api');\n  const data = res.json();\n  return data.id;\n}",
    correctAnswer: "3",
  },
  {
    codeSnippet: "const items = [1, 2, 3];\nconst doubled = items.map((n) => {\n  n * 2;\n});",
    correctAnswer: "3",
  },
  {
    codeSnippet: "const key = 'id';\nconst user = { id: 5 };\nconsole.log(user[key]);\nconsole.log(user.key);",
    correctAnswer: "4",
  },
  {
    codeSnippet: "function greet(name?: string) {\n  console.log(name.toUpperCase());\n}\ngreet();",
    correctAnswer: "2",
  },
];

export function buildMidBugQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    questionText: `Mid Bug ${i + 1}: Which line contains the bug?`,
    ...TEMPLATES[i % TEMPLATES.length],
    options: ["1", "2", "3", "4"],
    explanation: "Intermediate: async boundaries, map return values, bracket vs dot access, optional params.",
    type: "FIND_THE_BUG",
    difficulty: "MID",
  }));
}
