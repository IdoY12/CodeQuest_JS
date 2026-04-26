import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block06P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `async` before a function guarantee about its return value?",
        codeSnippet: "async function getData() {\n  return 42;\n}",
        correctAnswer: "It always returns a Promise",
        explanation: "Any async function always returns a Promise, even when you return a plain value.",
        options: [
          "It returns the value directly",
          "It always returns a Promise",
          "It runs synchronously",
          "It never throws",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `await` do inside an async function?",
        codeSnippet: "async function load() {\n  const data = await fetchData();\n}",
        correctAnswer: "Pauses the current function until the Promise resolves",
        explanation: "await suspends only the current async function, allowing the event loop to process other work.",
        options: [
          "Blocks the entire JavaScript thread",
          "Pauses the current function until the Promise resolves",
          "Converts a callback to a Promise",
          "Skips errors",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `.catch(handler)` handle?",
        codeSnippet: "fetch('/api').catch(err => console.error(err));",
        correctAnswer: "Rejected Promises or thrown errors",
        explanation: ".catch handles rejections and any errors thrown earlier in the Promise chain.",
        options: [
          "Resolved Promise values",
          "Rejected Promises or thrown errors",
          "Pending Promise states",
          "Timeout errors only",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is stored in `result` when `await` is accidentally omitted?",
        codeSnippet: "async function run() {\n  const result = fetch('/api/data');\n  console.log(result);\n}",
        correctAnswer: "A Promise object, not the resolved value",
        explanation: "Without await, you receive the Promise itself. Forgetting await is a common async bug.",
        options: [
          "The API response data",
          "A Promise object, not the resolved value",
          "undefined",
          "A TypeError",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does this eventually resolve to?",
        codeSnippet: "Promise.resolve(5).then(v => v * 2)",
        correctAnswer: "10",
        explanation: "Promise.resolve(5) creates a resolved promise; .then multiplies by 2, producing 10.",
        options: ["5", "10", "Promise(10)", "undefined"],
      }
];
