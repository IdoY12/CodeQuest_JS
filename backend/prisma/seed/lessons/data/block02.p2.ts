import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block02P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `&&` return when the left operand is falsy?",
        codeSnippet: "console.log(0 && 'hello');",
        correctAnswer: "The left operand",
        explanation: "&& short-circuits and returns the first falsy value it encounters.",
        options: ["true", "false", "The left operand", "The right operand"],
      },

      {
        type: "MCQ",
        prompt: "What is the final value of x?",
        codeSnippet: "let x = 0;\nwhile (x < 5) { x++; }\nconsole.log(x);",
        correctAnswer: "5",
        explanation: "The loop increments x until x equals 5, at which point x < 5 becomes false.",
        options: ["4", "5", "6", "0"],
      },

      {
        type: "MCQ",
        prompt: "What does `||` return when the left operand is truthy?",
        codeSnippet: "console.log('hello' || 'world');",
        correctAnswer: "The left operand",
        explanation: "|| short-circuits and returns the first truthy value it encounters.",
        options: ["The left operand", "The right operand", "true", "false"],
      }
];
