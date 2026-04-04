/**
 * Creates learning paths and chapter scaffolding referenced by lesson seeds.
 *
 * Responsibility: insert BEGINNER/ADVANCED paths and their chapter titles.
 * Layer: backend prisma seed
 * Depends on: @prisma/client
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";

export async function seedPathsAndChapters(prisma: PrismaClient): Promise<Map<string, string>> {
  const beginnerPath = await prisma.learningPath.create({
    data: {
      key: "BEGINNER",
      title: "JavaScript Foundations",
      description: "Start from zero and become confident with core JS concepts.",
    },
  });
  const advancedPath = await prisma.learningPath.create({
    data: {
      key: "ADVANCED",
      title: "Professional JavaScript",
      description: "Deep, practical ES6+ and backend architecture skills.",
    },
  });

  const chapters = await prisma.chapter.createManyAndReturn({
    data: [
      { pathId: beginnerPath.id, title: "What JavaScript Is", description: "console basics and browser runtime", orderIndex: 1 },
      { pathId: beginnerPath.id, title: "Variables and Values", description: "let, const, assignment, and reading values", orderIndex: 2 },
      { pathId: beginnerPath.id, title: "Data Types", description: "string, number, boolean, null, undefined", orderIndex: 3 },
      { pathId: beginnerPath.id, title: "Operators and Comparisons", description: "arithmetic and boolean logic", orderIndex: 4 },
      { pathId: beginnerPath.id, title: "Conditionals", description: "if/else and ternary branching", orderIndex: 5 },
      { pathId: beginnerPath.id, title: "Loops", description: "for, while, and break", orderIndex: 6 },
      { pathId: beginnerPath.id, title: "Functions", description: "declare, call, and return", orderIndex: 7 },
      { pathId: beginnerPath.id, title: "Arrays", description: "indexing and length fundamentals", orderIndex: 8 },
      { pathId: advancedPath.id, title: "Array Methods", description: "map/filter/reduce/find/some/every", orderIndex: 1 },
      { pathId: advancedPath.id, title: "Closures and Scope", description: "lexical scope and closure behavior", orderIndex: 2 },
      { pathId: advancedPath.id, title: "this Binding", description: "method invocation and arrow function behavior", orderIndex: 3 },
      { pathId: advancedPath.id, title: "Async JavaScript", description: "event loop, promises, async/await", orderIndex: 4 },
      { pathId: advancedPath.id, title: "Destructuring and Spread", description: "modern object and array syntax", orderIndex: 5 },
      { pathId: advancedPath.id, title: "ES6 Classes", description: "constructors, inheritance, and super", orderIndex: 6 },
      { pathId: advancedPath.id, title: "Node and Express Patterns", description: "routes, middleware, and response APIs", orderIndex: 7 },
      { pathId: advancedPath.id, title: "Error Handling and Edge Cases", description: "exceptions and runtime safety", orderIndex: 8 },
    ],
  });

  return new Map<string, string>(chapters.map((c) => [c.title, c.id]));
}
