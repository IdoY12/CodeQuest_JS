import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block08P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What is the primary role of the JavaScript event loop?",
        codeSnippet: "// call stack → microtask queue → macrotask queue",
        correctAnswer: "Move tasks from the queue to the call stack when the stack is empty",
        explanation: "The event loop checks if the call stack is empty, then processes microtasks, then one macrotask at a time.",
        options: [
          "Compile JavaScript before execution",
          "Move tasks from the queue to the call stack when the stack is empty",
          "Manage memory allocation",
          "Handle syntax errors at runtime",
        ],
      },

      {
        type: "MCQ",
        prompt: "Which queue is always drained before the macrotask queue?",
        codeSnippet: "Promise.resolve().then(() => console.log('micro'));\nsetTimeout(() => console.log('macro'), 0);",
        correctAnswer: "Microtask queue",
        explanation: "Microtasks (resolved Promises, queueMicrotask) are fully drained before the next macrotask runs.",
        options: ["Animation frame queue", "Microtask queue", "I/O queue", "Timer queue"],
      },

      {
        type: "MCQ",
        prompt: "What is a common cause of memory leaks in JavaScript?",
        codeSnippet: "element.addEventListener('click', heavyHandler);\n// handler never removed — reference stays alive",
        correctAnswer: "Forgotten event listeners that hold references to large objects",
        explanation: "Unremoved event listeners keep their closure's captured variables alive, preventing garbage collection.",
        options: [
          "Using const instead of let",
          "Forgotten event listeners that hold references to large objects",
          "Creating too many primitive values",
          "Calling JSON.stringify on large objects",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is the key difference between debounce and throttle?",
        codeSnippet: "// Debounce: wait 300ms after last keystroke\n// Throttle: fire at most once per 300ms",
        correctAnswer: "Debounce fires after inactivity ends; throttle fires at most once per interval",
        explanation: "Debounce waits for a quiet period before firing; throttle limits how often a function can fire regardless of activity.",
        options: [
          "Debounce delays once; throttle delays forever",
          "Debounce fires after inactivity ends; throttle fires at most once per interval",
          "Throttle cancels previous calls; debounce does not",
          "They are identical in behaviour",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does memoization do?",
        codeSnippet: "const memo = {};\nfunction fib(n) {\n  if (n in memo) return memo[n];\n  return (memo[n] = n <= 1 ? n : fib(n-1) + fib(n-2));\n}",
        correctAnswer: "Caches results so the same inputs skip recomputation",
        explanation: "Memoization trades memory for speed by storing computed results keyed by input.",
        options: [
          "Stores function bytecode",
          "Caches results so the same inputs skip recomputation",
          "Monitors memory usage at runtime",
          "Converts synchronous code to async",
        ],
      }
];
