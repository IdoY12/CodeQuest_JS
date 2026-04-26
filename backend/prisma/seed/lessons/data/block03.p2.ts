import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block03P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What is `['a', 'b', 'c'][1]`?",
        codeSnippet: "console.log(['a', 'b', 'c'][1]);",
        correctAnswer: '"b"',
        explanation: "Arrays are zero-indexed, so index 1 is the second element.",
        options: ['"a"', '"b"', '"c"', "undefined"],
      },

      {
        type: "MCQ",
        prompt: "What does `[5, 12, 3].find(n => n > 10)` return?",
        codeSnippet: "console.log([5, 12, 3].find(n => n > 10));",
        correctAnswer: "12",
        explanation: "find returns the first element that satisfies the condition — a single value, not an array.",
        options: ["[12]", "12", "3", "undefined"],
      },

      {
        type: "MCQ",
        prompt: "What is printed?",
        codeSnippet: "function noReturn() { }\nconsole.log(noReturn());",
        correctAnswer: "undefined",
        explanation: "A function without a return statement implicitly returns undefined.",
        options: ["null", "0", "undefined", "void"],
      },

      {
        type: "PUZZLE",
        prompt: "Fill in the method name to add 'c' to the end of the array.",
        codeSnippet: "const items = ['a', 'b'];\nitems.___('c');",
        correctAnswer: "push",
        explanation: "push is the standard array method for appending one or more elements to the end.",
        options: ["push", "add", "append", "insert"],
      }
];
