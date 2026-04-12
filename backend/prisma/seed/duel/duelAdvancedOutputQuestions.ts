/**
 * Duel question batch for Prisma seeding (duelAdvancedOutputQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

type QuestionTemplate = Pick<Prisma.DuelQuestionCreateManyInput, "codeSnippet" | "correctAnswer" | "options">;

const TEMPLATES: QuestionTemplate[] = [
  {
    codeSnippet: "Promise.resolve().then(() => console.log('micro'));\nsetTimeout(() => console.log('macro'), 0);\nconsole.log('sync');",
    correctAnswer: "sync, micro, macro",
    options: ["micro, sync, macro", "sync, micro, macro", "sync, macro, micro", "macro, sync, micro"],
  },
  {
    codeSnippet: "const obj = { x: 2, fn() { return this.x; } };\nconst f = obj.fn;\nconsole.log(f());",
    correctAnswer: "undefined",
    options: ["2", "undefined", "null", "TypeError"],
  },
  {
    codeSnippet: "const a = [1,2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);",
    correctAnswer: "3",
    options: ["2", "3", "1", "4"],
  },
  {
    codeSnippet: "async function run(){ return 7; }\nrun().then(v => console.log(v));\nconsole.log('after');",
    correctAnswer: "after, 7",
    options: ["7, after", "after, 7", "after only", "Promise pending"],
  },
  {
    codeSnippet: "const map = new Map();\nmap.set('x', 1);\nconsole.log(map.get('x'));",
    correctAnswer: "1",
    options: ["0", "1", "undefined", "NaN"],
  },
];

export function buildAdvancedOutputQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 20 }).map((_, i) => ({
    questionText: `Advanced Output ${i + 1}: What prints first / final value?`,
    ...TEMPLATES[i % TEMPLATES.length],
    explanation: "Advanced questions test event loop order, this binding, and references.",
    type: "MULTIPLE_CHOICE",
    difficulty: "SENIOR",
    category: "ASYNC",
  }));
}
