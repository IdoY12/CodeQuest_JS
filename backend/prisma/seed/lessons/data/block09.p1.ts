import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block09P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `Promise.all([p1, p2, p3])` do?",
        codeSnippet: "const [a, b] = await Promise.all([fetchA(), fetchB()]);",
        correctAnswer: "Resolves when all resolve, or rejects as soon as any rejects",
        explanation: "Promise.all is all-or-nothing: it waits for everyone to resolve but fails fast if any single promise rejects.",
        options: [
          "Runs promises sequentially and returns the last result",
          "Resolves when all resolve, or rejects as soon as any rejects",
          "Resolves when at least one promise resolves",
          "Always resolves even if promises reject",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `Promise.race([p1, p2])` return?",
        codeSnippet: "const result = await Promise.race([fast(), slow()]);",
        correctAnswer: "The result of the first promise to settle (resolve or reject)",
        explanation: "Promise.race settles as soon as any input promise settles — whether that means resolving or rejecting.",
        options: [
          "An array of the two fastest results",
          "The result of the first promise to settle (resolve or reject)",
          "The result of all promises combined",
          "The slowest promise's result",
        ],
      },

      {
        type: "MCQ",
        prompt: "How does `Promise.allSettled` differ from `Promise.all`?",
        codeSnippet: "const results = await Promise.allSettled([fetch('/a'), fetch('/b')]);",
        correctAnswer: "allSettled waits for all promises regardless of rejection",
        explanation: "allSettled never rejects — it returns an array of {status, value/reason} for every input promise.",
        options: [
          "allSettled runs promises in series; all runs them in parallel",
          "allSettled waits for all promises regardless of rejection",
          "allSettled ignores resolved promises",
          "allSettled only works with async functions",
        ],
      },

      {
        type: "MCQ",
        prompt: "What makes a generator function unique?",
        codeSnippet: "function* count() { yield 1; yield 2; yield 3; }\nconst g = count();\nconsole.log(g.next().value); // 1",
        correctAnswer: "It can pause execution and yield multiple values over time",
        explanation: "Generator functions use function* and yield to produce a sequence of values, pausing between each yield.",
        options: [
          "It always runs asynchronously",
          "It can pause execution and yield multiple values over time",
          "It can only be called once",
          "It returns a Promise automatically",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `Symbol('id')` guarantee?",
        codeSnippet: "const a = Symbol('id');\nconst b = Symbol('id');\nconsole.log(a === b); // false",
        correctAnswer: "Every call produces a unique value, even with the same description",
        explanation: "Symbols are unique primitives — two Symbols with the same description are never equal to each other.",
        options: [
          "The value is a string prefixed with 'id'",
          "Every call produces a unique value, even with the same description",
          "The symbol can be serialised to JSON",
          "The value is shared globally by default",
        ],
      }
];
