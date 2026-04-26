import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block05P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `...args` collect in `function f(a, ...args)`?",
        codeSnippet: "function f(a, ...args) { console.log(args); }\nf(1, 2, 3, 4);",
        correctAnswer: "All arguments after a",
        explanation: "Rest parameters collect all remaining arguments into a real array, here [2, 3, 4].",
        options: [
          "All arguments including a",
          "All arguments after a",
          "Only the last argument",
          "The arguments object",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is the result?",
        codeSnippet: "console.log([...new Set([1, 1, 2, 2, 3])]);",
        correctAnswer: "[1, 2, 3]",
        explanation: "new Set removes duplicates; spreading it back into an array gives the unique values.",
        options: ["[1, 2, 3]", "[1, 1, 2, 2, 3]", "Set(3)", "[3]"],
      },

      {
        type: "MCQ",
        prompt: "What does `[1, 2, 3, 4].reduce((acc, n) => acc + n, 0)` return?",
        codeSnippet: "console.log([1, 2, 3, 4].reduce((acc, n) => acc + n, 0));",
        correctAnswer: "10",
        explanation: "reduce accumulates: starting from 0 it adds 1+2+3+4 = 10.",
        options: ["10", "24", "0", "[1, 2, 3, 4]"],
      },

      {
        type: "PUZZLE",
        prompt: "Fill in the blank to destructure the `name` property from the object.",
        codeSnippet: "const user = { name: 'Sam', age: 25 };\nconst { ___ } = user;\nconsole.log(name);",
        correctAnswer: "name",
        explanation: "Object destructuring extracts a property using its key name.",
        options: ["name", "user.name", "'name'", "this.name"],
      },

      {
        type: "MCQ",
        prompt: "What type of values must a `WeakMap` use as keys?",
        codeSnippet: "const wm = new WeakMap();\nwm.set({}, 'value');",
        correctAnswer: "Objects only",
        explanation: "WeakMap keys must be objects, allowing the garbage collector to reclaim keys with no other references.",
        options: ["Strings only", "Objects only", "Numbers and strings", "Any primitive"],
      }
];
