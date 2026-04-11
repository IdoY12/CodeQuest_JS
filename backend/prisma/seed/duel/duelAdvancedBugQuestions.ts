/**
 * Duel question batch for Prisma seeding (duelAdvancedBugQuestions).
 *
 * Responsibility: synthetic duel questions for one category/difficulty.
 * Layer: backend prisma seed
 * Depends on: @prisma/client types
 * Consumers: persistDuelQuestions.ts
 */

import type { Prisma } from "@prisma/client";

export function buildAdvancedBugQuestions(): Prisma.DuelQuestionCreateManyInput[] {
  return Array.from({ length: 12 }).map((_, index) => ({
    questionText: `Advanced Bug ${index + 1}: Which line contains the bug?`,
    codeSnippet:
      index % 4 === 0
        ? "async function getData(){\n  const res = axios.get('/api');\n  return (await res).data;\n}"
        : index % 4 === 1
          ? "class User {}\nconst u = User();\nconsole.log(u);\nconst done = true;"
          : index % 4 === 2
            ? "app.use(auth);\napp.get('/x', handler);\nfunction auth(req,res,next){ res.send('blocked'); }\nconst done = true;"
            : "const query = `SELECT * FROM users WHERE id = ${id}`;\ndb.query(query);\nconst mode = 'unsafe';\nconsole.log(mode);",
    correctAnswer: index % 4 === 0 ? "2" : index % 4 === 1 ? "2" : index % 4 === 2 ? "3" : "1",
    options: ["1", "2", "3", "4"],
    explanation: "Advanced bug spotting focuses on async mistakes, middleware flow, and security.",
    type: "FIND_THE_BUG",
    difficulty: "SENIOR",
    category: "SCOPE",
  }))
}
