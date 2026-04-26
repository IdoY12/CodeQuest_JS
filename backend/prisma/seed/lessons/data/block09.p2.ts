import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block09P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does a `Proxy` object intercept?",
        codeSnippet: "const p = new Proxy(target, {\n  get(obj, key) { return key in obj ? obj[key] : 'default'; }\n});",
        correctAnswer: "Fundamental operations on an object (get, set, delete, etc.) via traps",
        explanation: "A Proxy wraps an object and intercepts fundamental operations through named handler traps.",
        options: [
          "Only method calls on an object",
          "Network requests made by the object",
          "Fundamental operations on an object (get, set, delete, etc.) via traps",
          "Only prototype chain lookups",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is currying?",
        codeSnippet: "const add = a => b => a + b;\nconsole.log(add(2)(3)); // 5",
        correctAnswer: "Transforming a multi-argument function into a chain of single-argument functions",
        explanation: "A curried function takes one argument at a time, returning a new function for each until all arguments are supplied.",
        options: [
          "Chaining .then() calls on a Promise",
          "Memoizing a function's results",
          "Transforming a multi-argument function into a chain of single-argument functions",
          "Combining two functions into one",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is partial application?",
        codeSnippet: "const multiply = (a, b) => a * b;\nconst double = multiply.bind(null, 2);\nconsole.log(double(5)); // 10",
        correctAnswer: "Pre-filling some arguments to produce a specialised function with fewer parameters",
        explanation: "Partial application fixes some of a function's arguments, returning a new function that requires only the remaining ones.",
        options: [
          "Calling a function with fewer arguments than declared",
          "Pre-filling some arguments to produce a specialised function with fewer parameters",
          "Breaking a large function into smaller ones",
          "Applying a function to part of an array",
        ],
      },

      {
        type: "PUZZLE",
        prompt: "Fill in the keyword that pauses the generator and emits a value.",
        codeSnippet: "function* range(start, end) {\n  for (let i = start; i < end; i++) {\n    ___ i;\n  }\n}",
        correctAnswer: "yield",
        explanation: "yield pauses the generator and returns the value to the caller; the next .next() call resumes from after the yield.",
        options: ["yield", "return", "await", "emit"],
      },

      {
        type: "MCQ",
        prompt: "What does `Reflect.ownKeys(obj)` return that `Object.keys(obj)` does not?",
        codeSnippet: "const s = Symbol('x');\nconst obj = { [s]: 1, a: 2 };\nconsole.log(Reflect.ownKeys(obj)); // [Symbol(x), 'a']",
        correctAnswer: "Symbol-keyed and non-enumerable string-keyed properties",
        explanation: "Reflect.ownKeys returns all own keys including Symbols and non-enumerable ones. Object.keys returns only own enumerable string keys.",
        options: [
          "Inherited enumerable properties",
          "Symbol-keyed and non-enumerable string-keyed properties",
          "Only prototype chain keys",
          "A live view of the object's properties",
        ],
      }
];
