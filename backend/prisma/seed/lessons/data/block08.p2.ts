import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block08P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What is lazy loading?",
        codeSnippet: "const module = await import('./heavy.js'); // loaded on demand",
        correctAnswer: "Deferring resource loading until it is actually needed",
        explanation: "Lazy loading reduces initial bundle size and startup time by only fetching code or assets when required.",
        options: [
          "Deferring resource loading until it is actually needed",
          "Loading all assets upfront for faster repeat visits",
          "Avoiding modules larger than 100 KB",
          "Caching API responses client-side",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does JavaScript's garbage collector do?",
        codeSnippet: "let obj = { data: 'big' };\nobj = null; // original object eligible for GC",
        correctAnswer: "Frees memory occupied by objects with no remaining references",
        explanation: "When no reference points to an object, the GC can reclaim its memory automatically.",
        options: [
          "Compresses unused variables",
          "Frees memory occupied by objects with no remaining references",
          "Removes unused imports at build time",
          "Schedules functions when memory is low",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `performance.now()` return?",
        codeSnippet: "const start = performance.now();\nheavyWork();\nconsole.log(performance.now() - start, 'ms');",
        correctAnswer: "A high-resolution timestamp in ms since the page started",
        explanation: "performance.now() provides sub-millisecond precision relative to navigation start, useful for profiling.",
        options: [
          "The current Unix timestamp in ms",
          "A high-resolution timestamp in ms since the page started",
          "Total CPU time used by the script",
          "Milliseconds since January 1, 1970",
        ],
      },

      {
        type: "MCQ",
        prompt: "Which closure pattern commonly causes memory leaks?",
        codeSnippet: "function attach(el) {\n  const bigData = getData();\n  el.onClick = () => process(bigData);\n}",
        correctAnswer: "A closure capturing a large variable stored on a long-lived object",
        explanation: "If the closure is attached to a long-lived element or global, the captured variable cannot be garbage-collected.",
        options: [
          "Closures that capture the global object",
          "A closure capturing a large variable stored on a long-lived object",
          "Arrow functions inside classes",
          "Closures that call themselves recursively",
        ],
      },

      {
        type: "PUZZLE",
        prompt: "Fill in the function used to schedule `fn` after the delay in this debounce implementation.",
        codeSnippet: "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = ___(fn, delay);\n  };\n}",
        correctAnswer: "setTimeout",
        explanation: "debounce clears any existing timer and sets a new one with setTimeout so fn fires only after the quiet period.",
        options: ["setTimeout", "setInterval", "requestAnimationFrame", "Promise.resolve"],
      }
];
