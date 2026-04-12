/**
 * Seeds curriculum lesson block 07 — Senior track, Architecture & Patterns.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js
 * Consumers: runAllLessonBlocks.ts
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_07(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
  await createLessonWithExercises(prisma, {
    chapterTitle: "Senior track",
    title: "Architecture and design patterns",
    description: "Singleton, Observer, SOLID principles, DI, Factory, and module patterns",
    estimatedMinutes: 16,
    orderIndex: 1,
    difficulty: "SENIOR",
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does the Singleton pattern ensure?",
        codeSnippet: "class Config {\n  static #instance = null;\n  static getInstance() {\n    return (this.#instance ??= new Config());\n  }\n}",
        correctAnswer: "Only one instance of a class exists in the application",
        explanation: "Singleton restricts instantiation to a single object, useful for shared resources like config or DB connections.",
        xpReward: 30,
        options: [
          "A class can be extended exactly once",
          "Only one instance of a class exists in the application",
          "Objects are immutable after creation",
          "A class can have only one method",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the core idea of the Observer pattern?",
        codeSnippet: "emitter.on('change', handler);\nemitter.emit('change', data);",
        correctAnswer: "A subject notifies dependent observers when its state changes",
        explanation: "Observer defines a one-to-many dependency: when the subject changes, all registered observers are notified.",
        xpReward: 30,
        options: [
          "One object controls the creation of others",
          "A subject notifies dependent observers when its state changes",
          "Objects wrap each other to extend functionality",
          "A single interface delegates to multiple implementations",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does the Single Responsibility Principle state?",
        codeSnippet: "// Bad: UserService handles auth AND email\n// Good: separate AuthService and EmailService",
        correctAnswer: "A class should have only one reason to change",
        explanation: "SRP states that a class/module should encapsulate one concern, making it easier to modify without side effects.",
        xpReward: 30,
        options: [
          "A module should only be imported once",
          "A class should have only one public method",
          "A class should have only one reason to change",
          "Functions should call only one other function",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is dependency injection?",
        codeSnippet: "// Without DI\nclass Service { db = new Database(); }\n// With DI\nclass Service { constructor(db) { this.db = db; } }",
        correctAnswer: "Providing a class's dependencies from outside rather than creating them internally",
        explanation: "DI decouples classes from their dependencies, making code easier to test and swap implementations.",
        xpReward: 30,
        options: [
          "Hard-coding dependencies inside a class",
          "Providing a class's dependencies from outside rather than creating them internally",
          "Injecting code into the prototype chain",
          "Using require() to load modules",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is the Factory pattern primarily used for?",
        codeSnippet: "function createUser(type) {\n  if (type === 'admin') return new Admin();\n  return new Guest();\n}",
        correctAnswer: "Centralising and abstracting the creation of objects",
        explanation: "A factory centralises object creation logic, hiding which specific class is instantiated from the caller.",
        xpReward: 30,
        options: [
          "Ensuring a class is only instantiated once",
          "Centralising and abstracting the creation of objects",
          "Combining multiple objects into one",
          "Making objects immutable",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does 'separation of concerns' mean?",
        codeSnippet: "// UI layer, service layer, and data layer are separate modules",
        correctAnswer: "Different responsibilities live in separate, independent modules",
        explanation: "Separation of concerns keeps distinct responsibilities isolated so each part can be understood, tested, and changed independently.",
        xpReward: 30,
        options: [
          "Each file should export only one function",
          "Different responsibilities live in separate, independent modules",
          "Modules should never share state",
          "Every function must have a single argument",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does the Open/Closed Principle state?",
        codeSnippet: "// Extend via subclass or composition; don't edit existing tested code",
        correctAnswer: "Open for extension, closed for modification",
        explanation: "OCP encourages adding new behaviour through extension rather than editing already-tested code.",
        xpReward: 30,
        options: [
          "Files should be open for reading but closed for writing",
          "Open for extension, closed for modification",
          "Public APIs should never change",
          "Each module needs an open and a closed state",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What does the Liskov Substitution Principle state?",
        codeSnippet: "// A Square extending Rectangle must behave as a Rectangle wherever one is expected",
        correctAnswer: "Subclasses must be substitutable for their parent without breaking behaviour",
        explanation: "LSP requires that objects of a subclass can replace parent-class objects without altering program correctness.",
        xpReward: 30,
        options: [
          "Parent classes must never reference child classes",
          "Subclasses must be substitutable for their parent without breaking behaviour",
          "Every subclass method must override the parent",
          "Interfaces must have at least one implementation",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What is inversion of control (IoC)?",
        codeSnippet: "// You define handlers; the framework decides when to call them",
        correctAnswer: "A framework controls program flow instead of your application code",
        explanation: "IoC shifts flow control from application code to a container or framework, enabling pluggable, decoupled architectures.",
        xpReward: 30,
        options: [
          "Reversing the order of function calls",
          "A framework controls program flow instead of your application code",
          "Inverting boolean conditions to simplify logic",
          "Using callbacks to reverse async order",
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "What distinguishes the module pattern from a plain namespace object?",
        codeSnippet: "const counter = (() => {\n  let count = 0;\n  return { increment: () => ++count, get: () => count };\n})();",
        correctAnswer: "The module pattern uses closure to enforce truly private state",
        explanation: "The module pattern wraps state in a closure so internal variables are inaccessible from outside. A plain namespace exposes all its properties.",
        xpReward: 30,
        options: [
          "Module pattern requires class syntax",
          "Namespaces can hold functions; modules cannot",
          "The module pattern uses closure to enforce truly private state",
          "There is no practical difference",
        ],
      },
    ],
  }, order);
}
