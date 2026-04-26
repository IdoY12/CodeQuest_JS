import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block02P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `===` check that `==` does not?",
        codeSnippet: "console.log(1 === '1');",
        correctAnswer: "Type and value",
        explanation: "=== (strict equality) checks both value and type without coercion.",
        options: ["Value only", "Type and value", "Reference equality", "Object identity"],
      },

      {
        type: "MCQ",
        prompt: "What does `console.log(1 == '1')` output?",
        codeSnippet: "console.log(1 == '1');",
        correctAnswer: "true",
        explanation: "== performs type coercion, converting the string '1' to the number 1 before comparing.",
        options: ["true", "false", "TypeError", "undefined"],
      },

      {
        type: "MCQ",
        prompt: "What does `!false` evaluate to?",
        codeSnippet: "console.log(!false);",
        correctAnswer: "true",
        explanation: "The ! operator inverts a boolean; !false is true.",
        options: ["false", "true", "null", "0"],
      },

      {
        type: "MCQ",
        prompt: "What does this ternary evaluate to?",
        codeSnippet: "const result = 10 > 3 ? 'yes' : 'no';",
        correctAnswer: '"yes"',
        explanation: "10 > 3 is true, so the ternary returns the first branch.",
        options: ['"yes"', '"no"', "true", "undefined"],
      },

      {
        type: "MCQ",
        prompt: "How many times does this loop run?",
        codeSnippet: "for (let i = 0; i < 4; i++) { }",
        correctAnswer: "4",
        explanation: "i starts at 0 and runs while i < 4, executing for i = 0, 1, 2, 3 — four times.",
        options: ["3", "4", "5", "infinite"],
      },

      {
        type: "MCQ",
        prompt: "What does `break` do inside a loop?",
        codeSnippet: "for (let i = 0; i < 10; i++) {\n  if (i === 3) break;\n}",
        correctAnswer: "Exits the loop immediately",
        explanation: "break terminates the enclosing loop immediately.",
        options: ["Skips to the next iteration", "Exits the loop immediately", "Restarts the loop", "Pauses execution"],
      },

      {
        type: "MCQ",
        prompt: "What does `continue` do inside a loop?",
        codeSnippet: "for (let i = 0; i < 5; i++) {\n  if (i === 2) continue;\n  console.log(i);\n}",
        correctAnswer: "Skips to the next iteration",
        explanation: "continue skips the rest of the current iteration body and moves to the next one.",
        options: ["Exits the loop", "Skips to the next iteration", "Restarts from the beginning", "Throws an error"],
      }
];
