/**
 * Duel question batch for Prisma seeding (duelAdvancedBugQuestions).
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
    codeSnippet: "async function getData(){\n  const res = axios.get('/api');\n  return (await res).data;\n}",
    correctAnswer: "2",
  },
  {
    codeSnippet: "class User {}\nconst u = User();\nconsole.log(u);\nconst done = true;",
    correctAnswer: "2",
  },
  {
    codeSnippet: "app.use(auth);\napp.get('/x', handler);\nfunction auth(req,res,next){ res.send('blocked'); }\nconst done = true;",
    correctAnswer: "3",
  },
  {
    codeSnippet: "const query = `SELECT * FROM users WHERE id = ${id}`;\ndb.query(query);\nconst mode = 'unsafe';\nconsole.log(mode);",
    correctAnswer: "1",
  },
];

export function buildAdvancedBugQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    questionText: `Advanced Bug ${i + 1}: Which line contains the bug?`,
    ...TEMPLATES[i % TEMPLATES.length],
    options: ["1", "2", "3", "4"],
    explanation: "Advanced bug spotting focuses on async mistakes, middleware flow, and security.",
    type: "FIND_THE_BUG",
    difficulty: "SENIOR",
    category: "SCOPE",
  }));
}
