import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block01P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `typeof null` return?",
        codeSnippet: "console.log(typeof null);",
        correctAnswer: '"object"',
        explanation: "A historical JavaScript bug — typeof null returns 'object', not 'null'.",
        options: ['"null"', '"object"', '"undefined"', '"boolean"'],
      },

      {
        type: "MCQ",
        prompt: "Which keyword allows a variable to be reassigned after declaration?",
        codeSnippet: "// choose the correct keyword",
        correctAnswer: "let",
        explanation: "let allows reassignment. const does not allow the binding to be reassigned.",
        options: ["const", "let", "final", "immutable"],
      },

      {
        type: "MCQ",
        prompt: "What does `Boolean(\"\")` return?",
        codeSnippet: 'console.log(Boolean(""));',
        correctAnswer: "false",
        explanation: "An empty string is one of JavaScript's falsy values.",
        options: ["true", "false", "null", "undefined"],
      },

      {
        type: "MCQ",
        prompt: "What is the output?",
        codeSnippet: "let score = 100;\nconsole.log(typeof score);",
        correctAnswer: '"number"',
        explanation: "The number literal 100 has type 'number'.",
        options: ['"string"', '"number"', '"integer"', '"boolean"'],
      },

      {
        type: "MCQ",
        prompt: "What happens when you try to reassign a const?",
        codeSnippet: "const MAX = 100;\nMAX = 200;",
        correctAnswer: "It throws a TypeError",
        explanation: "const bindings cannot be reassigned after initialisation.",
        options: ["MAX silently stays 100", "MAX becomes 200", "It throws a TypeError", "MAX becomes undefined"],
      },

      {
        type: "MCQ",
        prompt: "What does `typeof undefined` return?",
        codeSnippet: "console.log(typeof undefined);",
        correctAnswer: '"undefined"',
        explanation: "undefined is its own primitive type with the type string 'undefined'.",
        options: ['"null"', '"void"', '"undefined"', '"object"'],
      },

      {
        type: "MCQ",
        prompt: "Tap the value that is falsy.",
        codeSnippet: 'const candidates = [0, "false", 1, true];',
        correctAnswer: "0",
        explanation: '0 is falsy. The string "false" is a non-empty string and therefore truthy.',
        options: ["0", '"false"', "1", "true"],
      }
];
