import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block07P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does the Singleton pattern ensure?",
        codeSnippet: "class Config {\n  static #instance = null;\n  static getInstance() {\n    return (this.#instance ??= new Config());\n  }\n}",
        correctAnswer: "Only one instance of a class exists in the application",
        explanation: "Singleton restricts instantiation to a single object, useful for shared resources like config or DB connections.",
        options: [
          "A class can be extended exactly once",
          "Only one instance of a class exists in the application",
          "Objects are immutable after creation",
          "A class can have only one method",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is the core idea of the Observer pattern?",
        codeSnippet: "emitter.on('change', handler);\nemitter.emit('change', data);",
        correctAnswer: "A subject notifies dependent observers when its state changes",
        explanation: "Observer defines a one-to-many dependency: when the subject changes, all registered observers are notified.",
        options: [
          "One object controls the creation of others",
          "A subject notifies dependent observers when its state changes",
          "Objects wrap each other to extend functionality",
          "A single interface delegates to multiple implementations",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does the Single Responsibility Principle state?",
        codeSnippet: "// Bad: UserService handles auth AND email\n// Good: separate AuthService and EmailService",
        correctAnswer: "A class should have only one reason to change",
        explanation: "SRP states that a class/module should encapsulate one concern, making it easier to modify without side effects.",
        options: [
          "A module should only be imported once",
          "A class should have only one public method",
          "A class should have only one reason to change",
          "Functions should call only one other function",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is dependency injection?",
        codeSnippet: "// Without DI\nclass Service { db = new Database(); }\n// With DI\nclass Service { constructor(db) { this.db = db; } }",
        correctAnswer: "Providing a class's dependencies from outside rather than creating them internally",
        explanation: "DI decouples classes from their dependencies, making code easier to test and swap implementations.",
        options: [
          "Hard-coding dependencies inside a class",
          "Providing a class's dependencies from outside rather than creating them internally",
          "Injecting code into the prototype chain",
          "Using require() to load modules",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is the Factory pattern primarily used for?",
        codeSnippet: "function createUser(type) {\n  if (type === 'admin') return new Admin();\n  return new Guest();\n}",
        correctAnswer: "Centralising and abstracting the creation of objects",
        explanation: "A factory centralises object creation logic, hiding which specific class is instantiated from the caller.",
        options: [
          "Ensuring a class is only instantiated once",
          "Centralising and abstracting the creation of objects",
          "Combining multiple objects into one",
          "Making objects immutable",
        ],
      }
];
