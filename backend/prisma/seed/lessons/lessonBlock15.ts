/**
 * Seeds one curriculum lesson block (exercises + metadata) into Prisma.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js, ../lib/requireChapterId.js
 * Consumers: ../runMain.js
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_15(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Node and Express Patterns",
      title: "Backend Request Flow",
      description: "Understand req/res and middleware order",
      estimatedMinutes: 12,
      orderIndex: 1,
      difficulty: "SENIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "In an Express route, what is req?",
          codeSnippet: "app.get('/users', (req, res) => {\n  res.json([]);\n});",
          correctAnswer: "The incoming request object",
          explanation: "req contains params, query, body, headers, and more.",
          xpReward: 25,
          options: ["The outgoing response", "The incoming request object", "The database connection", "A middleware array"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does res.json() do?",
          codeSnippet: "res.json({ ok: true });",
          correctAnswer: "Sends a JSON response body",
          explanation: "res.json serializes and sends JSON to the client.",
          xpReward: 25,
          options: ["Parses JSON from req", "Sends a JSON response body", "Writes file to disk", "Ends app process"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "When does middleware run?",
          codeSnippet: "app.use(auth);\napp.get('/secure', handler);",
          correctAnswer: "Before the matching route handler",
          explanation: "Middleware in the chain runs before the route handler unless it ends response.",
          xpReward: 25,
          options: ["After handler only", "Before the matching route handler", "Only on POST", "Only on errors"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Pick the token for CommonJS import.",
          codeSnippet: "const express = ___('express');",
          correctAnswer: "require",
          explanation: "CommonJS modules use require(...).",
          xpReward: 25,
          options: ["require", "import", "export", "include"],
        },
      ],
    }, order);
}
