import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block03P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What is the key difference between a function declaration and a function expression?",
        codeSnippet: "// Declaration\nfunction greet() {}\n// Expression\nconst greet2 = function() {};",
        correctAnswer: "Declarations are hoisted; expressions are not",
        explanation: "Function declarations are hoisted so they can be called before they appear in source. Expressions are not.",
        options: [
          "Declarations are hoisted; expressions are not",
          "Expressions are always faster",
          "Declarations require a return statement",
          "There is no practical difference",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `arr.push(5)` do?",
        codeSnippet: "const arr = [1, 2, 3];\narr.push(5);",
        correctAnswer: "Adds 5 to the end of the array",
        explanation: "push appends the given value to the end of the array and returns the new length.",
        options: [
          "Adds 5 to the beginning",
          "Removes the last element",
          "Adds 5 to the end of the array",
          "Returns the element at index 5",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is the output?",
        codeSnippet: "const double = n => n * 2;\nconsole.log(double(4));",
        correctAnswer: "8",
        explanation: "A concise arrow function implicitly returns the expression. 4 × 2 = 8.",
        options: ["4", "8", "2", "undefined"],
      },

      {
        type: "MCQ",
        prompt: "What does this return?",
        codeSnippet: "console.log([1, 2, 3, 4].filter(n => n > 2));",
        correctAnswer: "[3, 4]",
        explanation: "filter returns a new array containing only elements for which the callback returns true.",
        options: ["[1, 2]", "[3, 4]", "[2, 3, 4]", "[1]"],
      },

      {
        type: "MCQ",
        prompt: "What does `arr.pop()` do?",
        codeSnippet: "const arr = [1, 2, 3];\nconst last = arr.pop();",
        correctAnswer: "Removes and returns the last element",
        explanation: "pop removes the last element from the array, mutates it, and returns the removed element.",
        options: [
          "Adds an element to the end",
          "Removes and returns the last element",
          "Removes and returns the first element",
          "Returns without removing",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `[1, 2, 3].map(n => n + 10)` return?",
        codeSnippet: "console.log([1, 2, 3].map(n => n + 10));",
        correctAnswer: "[11, 12, 13]",
        explanation: "map creates a new array by applying the callback to each element.",
        options: ["[1, 2, 3]", "[11, 12, 13]", "[10, 10, 10]", "[10, 11, 12]"],
      }
];
