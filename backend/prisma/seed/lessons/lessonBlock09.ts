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

export async function seedLessonBlock_09(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Senior track",
      title: "Architecture, HTTP, and safe failure modes",
      description: "Express-style handlers, errors, and security-minded defaults",
      estimatedMinutes: 14,
      orderIndex: 3,
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
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does try/catch catch?",
          codeSnippet: "try { JSON.parse('{bad'); } catch (e) { console.log('caught'); }",
          correctAnswer: "Runtime exceptions thrown inside try",
          explanation: "catch handles exceptions thrown during runtime execution.",
          xpReward: 25,
          options: ["All syntax errors at compile time", "Runtime exceptions thrown inside try", "Network latency", "Type declarations"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What happens here?",
          codeSnippet: "const x = null;\nconsole.log(x.name);",
          correctAnswer: "Throws a TypeError",
          explanation: "You cannot access properties on null.",
          xpReward: 25,
          options: ["undefined", "null", "Throws a TypeError", "''"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does JSON.parse do with invalid JSON?",
          codeSnippet: "JSON.parse('{ name: \"Ada\" }');",
          correctAnswer: "Throws an exception",
          explanation: "Invalid JSON syntax causes JSON.parse to throw.",
          xpReward: 25,
          options: ["Returns null", "Fixes and parses it", "Throws an exception", "Returns empty object"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "Why validate and encode user-controlled strings before inserting into HTML?",
          codeSnippet: "// innerHTML = userInput",
          correctAnswer: "To mitigate XSS by preventing script injection",
          explanation: "Untrusted HTML can execute scripts in the page context.",
          xpReward: 25,
          options: [
            "To improve SEO only",
            "To mitigate XSS by preventing script injection",
            "Because strings are immutable",
            "To shrink bundle size",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the primary purpose of SameSite cookies?",
          codeSnippet: "// Set-Cookie: sid=...; SameSite=Lax",
          correctAnswer: "Reduce cross-site request forgery risk for cookie-backed sessions",
          explanation: "SameSite limits when cookies are sent on cross-site navigations or requests.",
          xpReward: 25,
          options: [
            "Speed up DNS",
            "Reduce cross-site request forgery risk for cookie-backed sessions",
            "Encrypt the cookie payload",
            "Disable HTTPS",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "When profiling a slow UI thread, what often dominates?",
          codeSnippet: "// Performance panel, long tasks",
          correctAnswer: "Long synchronous JS, layout, and paint work",
          explanation: "Breaking up work and avoiding forced synchronous layout improves responsiveness.",
          xpReward: 25,
          options: [
            "Wi-Fi signal strength",
            "Long synchronous JS, layout, and paint work",
            "Number of comments in source",
            "Dark mode",
          ],
        },
      ],
    }, order);
}
