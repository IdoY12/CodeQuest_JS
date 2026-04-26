import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block01P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What is the result?",
        codeSnippet: 'console.log(1 + "2");',
        correctAnswer: '"12"',
        explanation: "When + has a string operand, the other operand is coerced to a string and concatenated.",
        options: ["3", '"12"', "NaN", "TypeError"],
      },

      {
        type: "MCQ",
        prompt: "What does `typeof true` return?",
        codeSnippet: "console.log(typeof true);",
        correctAnswer: '"boolean"',
        explanation: "Boolean values have the primitive type 'boolean'.",
        options: ['"boolean"', '"string"', '"number"', '"bool"'],
      },

      {
        type: "MCQ",
        prompt: "What is logged?",
        codeSnippet: "let a = 5;\nlet b = a;\nb = 10;\nconsole.log(a);",
        correctAnswer: "5",
        explanation: "Primitives are copied by value. Reassigning b does not affect a.",
        options: ["5", "10", "undefined", "null"],
      }
];
