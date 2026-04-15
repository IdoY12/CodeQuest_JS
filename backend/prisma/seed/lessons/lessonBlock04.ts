/**
 * Seeds curriculum lesson block 04 — Mid track, Objects & Classes.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_04(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Mid track",
    title: "Objects, classes, and `this`",
    description: "Constructors, methods, this, inheritance with extends, and super",
    estimatedMinutes: 14,
    orderIndex: 1,
    difficulty: "MID",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "How do you access the `name` property of `obj` using bracket notation?",
        codeSnippet: "const obj = { name: 'Alice' };\n// access with bracket notation",
        correctAnswer: 'obj["name"]',
        explanation: "Bracket notation accepts a string key inside square brackets.",
        options: ['obj["name"]', "obj.(name)", "obj->name", "obj::name"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `this` refer to inside a regular class method?",
        codeSnippet: "class Dog {\n  bark() { console.log(this.name); }\n}",
        correctAnswer: "The instance the method is called on",
        explanation: "Inside a class method, this refers to the specific object instance on which the method is invoked.",
        options: [
          "The global object",
          "The instance the method is called on",
          "The class constructor function",
          "undefined",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Which keyword sets up class inheritance in JavaScript?",
        codeSnippet: "class Puppy ___ Dog { }",
        correctAnswer: "extends",
        explanation: "extends establishes the prototype chain so Puppy inherits Dog's methods.",
        options: ["implements", "extends", "inherits", "derives"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is `super()` used for in a subclass constructor?",
        codeSnippet: "class Puppy extends Dog {\n  constructor(name) {\n    super(name);\n  }\n}",
        correctAnswer: "Calls the parent class constructor",
        explanation: "super() must be called before using this in a subclass constructor; it runs the parent's constructor.",
        options: [
          "Calls the parent class constructor",
          "Creates a static copy of the parent",
          "Accesses the parent's private fields",
          "Calls sibling class methods",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does the `new` keyword do?",
        codeSnippet: "const dog = new Dog('Rex');",
        correctAnswer: "Creates an instance of a class",
        explanation: "new creates a new object, sets its prototype, runs the constructor, and returns the instance.",
        options: [
          "Allocates raw memory",
          "Creates an instance of a class",
          "Declares a new constant binding",
          "Copies an existing object",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the result of accessing a property that doesn't exist on an object?",
        codeSnippet: "const obj = { a: 1 };\nconsole.log(obj.b);",
        correctAnswer: "undefined",
        explanation: "Accessing a non-existent property returns undefined rather than throwing an error.",
        options: ["null", "TypeError", "undefined", "0"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `Object.keys(obj)` return?",
        codeSnippet: "const obj = { x: 1, y: 2 };\nconsole.log(Object.keys(obj));",
        correctAnswer: "An array of own enumerable property names",
        explanation: "Object.keys returns an array of the object's own enumerable string-keyed property names.",
        options: [
          "An array of property values",
          "An array of own enumerable property names",
          "An object with swapped keys and values",
          "The number of properties",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does `hasOwnProperty('key')` check?",
        codeSnippet: "const obj = { a: 1 };\nconsole.log(obj.hasOwnProperty('a'));",
        correctAnswer: "Whether the object itself (not its prototype) has that property",
        explanation: "hasOwnProperty only checks properties defined directly on the object, not inherited ones.",
        options: [
          "Whether the object or prototype chain has the property",
          "Whether the property value is truthy",
          "Whether the object itself (not its prototype) has that property",
          "Whether the property is writable",
        ],
      },
      {
        type: "CODE_FILL",
        prompt: "Fill in the instance property name to increment the counter.",
        codeSnippet: "class Counter {\n  constructor() { this.count = 0; }\n  increment() { this.___ += 1; }\n}",
        correctAnswer: "count",
        explanation: "this.count refers to the count property set in the constructor.",
        options: ["count", "value", "total", "self"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is an object literal in JavaScript?",
        codeSnippet: "const person = { name: 'Bob', age: 30 };",
        correctAnswer: "A value defined using { key: value } syntax",
        explanation: "Object literals are the most common way to create objects using curly-brace syntax.",
        options: [
          "A string that looks like an object",
          "An object created with Object.create()",
          "A frozen, immutable object",
          "A value defined using { key: value } syntax",
        ],
      },
    ],
  }, order);
}
