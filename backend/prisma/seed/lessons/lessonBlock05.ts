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

export async function seedLessonBlock_05(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Mid track",
      title: "Maps, sets, and array patterns",
      description: "Choose the right collection API for lookups and uniqueness",
      estimatedMinutes: 14,
      orderIndex: 2,
      difficulty: "MID",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this log?",
          codeSnippet: "const m = new Map([['a', 1], ['b', 2]]);\nm.set('a', 9);\nconsole.log(m.get('a'));",
          correctAnswer: "9",
          explanation: "Map.set overwrites the value for an existing key.",
          xpReward: 25,
          options: ["1", "9", "undefined", "2"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "Why prefer `Map` over a plain object for arbitrary keys?",
          codeSnippet: "// keys can be objects, no prototype collisions",
          correctAnswer: "Any value can be a key without prototype key clashes",
          explanation: "Maps keep keys in insertion order and avoid inherited property names like `toString`.",
          xpReward: 25,
          options: [
            "Maps are always faster than objects",
            "Any value can be a key without prototype key clashes",
            "Objects cannot store numbers",
            "Maps serialize to JSON automatically",
          ],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the call that removes duplicates from an array of numbers.",
          codeSnippet: "const nums = [1, 1, 2];\nconst uniq = [...new ___(nums)];",
          correctAnswer: "Set",
          explanation: "Set stores unique values; spread back into an array.",
          xpReward: 25,
          options: ["Set", "Map", "WeakMap", "Array"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is the size of `s` after this code?",
          codeSnippet: "const s = new Set([1, 2, 2, 3]);\ns.add(3);",
          correctAnswer: "3",
          explanation: "Set ignores duplicate inserts; 1,2,3 remain three entries.",
          xpReward: 25,
          options: ["4", "3", "5", "2"],
        },
        {
          type: "CODE_FILL",
          prompt: "Fill the blank to shallow-copy all elements into a new array.",
          codeSnippet: "const src = [1, 2, 3];\nconst copy = ___;",
          correctAnswer: "[...src]",
          explanation: "Spreading `src` into an array literal copies elements into a new array.",
          xpReward: 25,
          options: ["[...src]", "src", "...src", "src.slice"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `[...arr].reverse()` do compared to `arr.reverse()`?",
          codeSnippet: "// compare mutation",
          correctAnswer: "Only the spread version leaves `arr` unchanged",
          explanation: "Array.prototype.reverse mutates in place; copying first avoids that.",
          xpReward: 25,
          options: [
            "Both return the same reference",
            "Only the spread version leaves `arr` unchanged",
            "Both throw on sparse arrays",
            "`reverse` cannot run on numbers",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `flatMap` return here?",
          codeSnippet: "const out = [1, 2].flatMap(n => [n, n * 10]);\nconsole.log(out.length);",
          correctAnswer: "4",
          explanation: "Each element expands to two values, then flattened one level: four items.",
          xpReward: 25,
          options: ["2", "4", "6", "1"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the method that returns the first element matching a predicate.",
          codeSnippet: "const users = [{id:1},{id:2}];\nconst u = users.___(x => x.id === 2);",
          correctAnswer: "find",
          explanation: "`find` stops at the first match and returns that element.",
          xpReward: 25,
          options: ["find", "filter", "map", "some"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "const g = new Map([[{}, 1]]);\nconst k = [...g.keys()][0];\nconsole.log(g.get(k));",
          correctAnswer: "1",
          explanation: "The same object reference used as key retrieves the stored value.",
          xpReward: 25,
          options: ["undefined", "1", "null", "NaN"],
        },
        {
          type: "DRAG_DROP",
          prompt: "Arrange lines to group unique ids with Set then check membership.",
          codeSnippet: "const ids = new Set([1, 2, 2]);\nconsole.log(ids.has(2));\nconsole.log(ids.size);",
          correctAnswer: "const ids = new Set([1, 2, 2]);||console.log(ids.has(2));||console.log(ids.size);",
          explanation: "Construct the Set, then query membership and size.",
          xpReward: 30,
        },
      ],
    }, order);
}
