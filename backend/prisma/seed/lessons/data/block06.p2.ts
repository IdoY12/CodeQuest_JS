import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block06P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `setTimeout(fn, 0)` guarantee?",
        codeSnippet: "setTimeout(() => console.log('async'), 0);\nconsole.log('sync');",
        correctAnswer: "fn runs after all synchronous code completes",
        explanation: "Even with delay 0, setTimeout schedules fn in the macrotask queue, after synchronous code and microtasks.",
        options: [
          "fn runs immediately",
          "fn runs before any Promises resolve",
          "fn runs after all synchronous code completes",
          "fn runs exactly 0 ms later",
        ],
      },

      {
        type: "MCQ",
        prompt: "How can you handle errors in async/await?",
        codeSnippet: "async function load() {\n  try {\n    await riskyOp();\n  } catch (e) { }\n}",
        correctAnswer: "Both try/catch and .catch() on the returned Promise",
        explanation: "Errors can be caught with try/catch inside the function, or with .catch() on the Promise it returns.",
        options: [
          "Only try/catch inside the function",
          "Only .catch() on the call site",
          "Both try/catch and .catch() on the returned Promise",
          "Async functions never throw",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `try/catch` catch?",
        codeSnippet: "try {\n  throw new Error('oops');\n} catch (e) {\n  console.log(e.message);\n}",
        correctAnswer: "Any thrown value within the try block",
        explanation: "try/catch catches any thrown value — Error objects, strings, numbers — from within the try block.",
        options: [
          "Only network errors",
          "Only TypeError instances",
          "Only syntax errors",
          "Any thrown value within the try block",
        ],
      },

      {
        type: "PUZZLE",
        prompt: "Fill in the keyword that marks a function as asynchronous.",
        codeSnippet: "___ function loadUser() {\n  const user = await fetchUser();\n  return user;\n}",
        correctAnswer: "async",
        explanation: "The async keyword enables await inside a function and makes it return a Promise.",
        options: ["async", "await", "Promise", "defer"],
      },

      {
        type: "MCQ",
        prompt: "What is the most common cause of an 'unhandled promise rejection' warning?",
        codeSnippet: "fetch('/missing'); // no .catch",
        correctAnswer: "A Promise that rejects with no .catch or try/catch",
        explanation: "Any rejected Promise without an error handler triggers an unhandled rejection warning.",
        options: [
          "Using async/await instead of .then()",
          "A Promise that rejects with no .catch or try/catch",
          "Calling await outside an async function",
          "Using setTimeout inside a Promise",
        ],
      }
];
