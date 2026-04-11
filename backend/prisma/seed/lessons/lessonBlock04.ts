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

export async function seedLessonBlock_04(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Mid track",
      title: "Objects, classes, and `this`",
      description: "Reason about constructors, methods, and object behavior",
      estimatedMinutes: 14,
      orderIndex: 1,
      difficulty: "MID",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this log?",
          codeSnippet: "class Counter { n = 0; bump() { this.n++; } }\nconst c = new Counter();\nc.bump();\nconsole.log(c.n);",
          correctAnswer: "1",
          explanation: "bump runs with `this` bound to the instance, so n becomes 1.",
          xpReward: 25,
          options: ["0", "1", "undefined", "NaN"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is true about this factory function?",
          codeSnippet: "function makeUser(name) {\n  return { name, greet() { return `Hi, ${this.name}`; } };\n}",
          correctAnswer: "greet uses `this` to read the enclosing object",
          explanation: "Methods on object literals get dynamic `this` from the call site.",
          xpReward: 25,
          options: [
            "greet always sees a global `this`",
            "greet uses `this` to read the enclosing object",
            "`this` is lexically bound like an arrow function",
            "name is private to greet",
          ],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the expression that creates an instance.",
          codeSnippet: "class Box {}\nconst b = new Box();",
          correctAnswer: "new Box()",
          explanation: "`new` calls the constructor and returns an instance.",
          xpReward: 25,
          options: ["class Box", "new Box()", "const b", "Box {}"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this output?",
          codeSnippet: "const o = { v: 1, m: () => this?.v };\nconsole.log(o.m());",
          correctAnswer: "undefined",
          explanation: "Arrow methods do not receive their own `this` from the object; `this` follows lexical rules.",
          xpReward: 25,
          options: ["1", "undefined", "o", "NaN"],
        },
        {
          type: "CODE_FILL",
          prompt: "Fill the blank so `Dog` inherits behavior from `Animal`.",
          codeSnippet: "class Animal { speak() { return '...'; } }\nclass Dog ___ Animal {\n  speak() { return 'woof'; }\n}",
          correctAnswer: "extends",
          explanation: "`extends` sets up prototype inheritance between classes.",
          xpReward: 25,
          options: ["extends", "implements", "inherits", "from"],
        },
        {
          type: "FIND_THE_BUG",
          prompt: "Tap the line missing `new` for the constructor call.",
          codeSnippet: "class Box {\n  constructor(v) { this.v = v; }\n}\nconst b = Box(1);",
          correctAnswer: "4",
          explanation: "Call `new Box(1)` so `this` is set inside the constructor.",
          xpReward: 25,
          options: ["1", "2", "3", "4"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `Object.create(proto)` do?",
          codeSnippet: "const base = { a: 1 };\nconst child = Object.create(base);\nconsole.log(child.a);",
          correctAnswer: "Makes an object whose prototype is `base`",
          explanation: "Object.create links the new object's [[Prototype]] to the argument.",
          xpReward: 25,
          options: [
            "Copies enumerable keys into a new object",
            "Makes an object whose prototype is `base`",
            "Freezes `base`",
            "Returns `base` unchanged",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "function show() { return this.x; }\nconst obj = { x: 7, show };\nconsole.log(obj.show());",
          correctAnswer: "7",
          explanation: "When `show` is called as `obj.show()`, `this` is `obj`.",
          xpReward: 25,
          options: ["undefined", "7", "show", "NaN"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Tap the keyword that invokes a parent method from a subclass.",
          codeSnippet: "class B extends A {\n  m() { /* keyword */ super.m(); }\n}",
          correctAnswer: "super",
          explanation: "`super` reaches the parent class prototype for methods.",
          xpReward: 25,
          options: ["super", "this", "extends", "base"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does `static` on a class method mean?",
          codeSnippet: "class Util { static id() { return 1; } }\nconsole.log(Util.id());",
          correctAnswer: "It lives on the constructor, not each instance",
          explanation: "Static members are properties of the class function itself.",
          xpReward: 25,
          options: [
            "It runs only once ever",
            "It lives on the constructor, not each instance",
            "It cannot return values",
            "It is private to instances",
          ],
        },
      ],
    },
    order);
}
