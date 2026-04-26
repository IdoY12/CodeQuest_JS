/**
 * Duel question batch for Prisma seeding (MID / intermediate output questions).
 *
 * Responsibility: synthetic duel questions between JUNIOR and SENIOR difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

type QuestionTemplate = Pick<Prisma.DuelQuestionCreateManyInput, "codeSnippet" | "correctAnswer" | "options">;

const TEMPLATES: QuestionTemplate[] = [
  {
    codeSnippet: "const a = { n: 1 };\nconst b = { ...a, n: 2 };\nconsole.log(b.n);",
    correctAnswer: "2",
    options: ["1", "2", "undefined", "NaN"],
  },
  {
    codeSnippet: "const p = Promise.resolve(3);\np.then((x) => x * 2).then(console.log);\nconsole.log('tail');",
    correctAnswer: "tail, 6",
    options: ["6, tail", "tail, 6", "tail only", "6 only"],
  },
  {
    codeSnippet: "const f = (x = 10) => x;\nconsole.log(f(undefined));",
    correctAnswer: "10",
    options: ["undefined", "10", "NaN", "0"],
  },
  {
    codeSnippet: "const nums = [1, 2, 3];\nconst doubled = nums.flatMap((n) => [n, n * 2]);\nconsole.log(doubled.length);",
    correctAnswer: "6",
    options: ["3", "6", "9", "2"],
  },
  {
    codeSnippet: "const user = { id: 1, name: 'Ada' };\nconst { name: label } = user;\nconsole.log(label);",
    correctAnswer: "Ada",
    options: ["user", "label", "Ada", "undefined"],
  },
  {
    codeSnippet: "console.log(['a', 'b'].sort().join('-'));",
    correctAnswer: "a-b",
    options: ["b-a", "a-b", "ab", "a, b"],
  },
];

export function buildMidOutputQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 20 }).map((_, i) => ({
    questionText: `Mid Output ${i + 1}: What is printed (order / final value)?`,
    ...TEMPLATES[i % TEMPLATES.length],
    explanation: "Intermediate: destructuring, defaults, spreads, and basic async ordering.",
    type: "MCQ",
    difficulty: "MID",
  }));
}
