import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block05P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does a `Map` preserve that a plain object does not?",
        codeSnippet: "const map = new Map();\nmap.set(1, 'one');\nmap.set('two', 2);",
        correctAnswer: "Insertion order for any key type",
        explanation: "Map preserves insertion order for all key types, including objects and numbers.",
        options: [
          "String-only key access",
          "Insertion order for any key type",
          "Prototype chain inheritance",
          "JSON serialisation support",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does a `Set` guarantee about its values?",
        codeSnippet: "const s = new Set([1, 2, 2, 3]);\nconsole.log(s.size);",
        correctAnswer: "Each value appears at most once",
        explanation: "A Set automatically discards duplicate values on insertion.",
        options: [
          "Values are sorted automatically",
          "Values are all the same type",
          "Each value appears at most once",
          "Values are immutable",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does the spread operator do in `Math.max(...[3, 1, 4])`?",
        codeSnippet: "console.log(Math.max(...[3, 1, 4]));",
        correctAnswer: "Expands the array into individual arguments",
        explanation: "... unpacks the array so Math.max receives three separate numeric arguments.",
        options: [
          "Creates a shallow copy of the array",
          "Expands the array into individual arguments",
          "Concatenates multiple arrays",
          "Converts the array to a string",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `const [a, b] = [10, 20]` do?",
        codeSnippet: "const [a, b] = [10, 20];\nconsole.log(a, b);",
        correctAnswer: "Assigns 10 to a and 20 to b",
        explanation: "Array destructuring unpacks values by position into the named variables.",
        options: [
          "Creates an array [a, b]",
          "Assigns 10 to a and 20 to b",
          "Checks if a equals 10",
          "Creates a tuple",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `Array.from('hello')` return?",
        codeSnippet: "console.log(Array.from('hello'));",
        correctAnswer: "['h','e','l','l','o']",
        explanation: "Array.from iterates any iterable — here it splits the string into individual characters.",
        options: ["['hello']", "['h','e','l','l','o']", "5", "[104,101,108,108,111]"],
      }
];
