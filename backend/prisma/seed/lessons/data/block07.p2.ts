import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block07P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does 'separation of concerns' mean?",
        codeSnippet: "// UI layer, service layer, and data layer are separate modules",
        correctAnswer: "Different responsibilities live in separate, independent modules",
        explanation: "Separation of concerns keeps distinct responsibilities isolated so each part can be understood, tested, and changed independently.",
        options: [
          "Each file should export only one function",
          "Different responsibilities live in separate, independent modules",
          "Modules should never share state",
          "Every function must have a single argument",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does the Open/Closed Principle state?",
        codeSnippet: "// Extend via subclass or composition; don't edit existing tested code",
        correctAnswer: "Open for extension, closed for modification",
        explanation: "OCP encourages adding new behaviour through extension rather than editing already-tested code.",
        options: [
          "Files should be open for reading but closed for writing",
          "Open for extension, closed for modification",
          "Public APIs should never change",
          "Each module needs an open and a closed state",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does the Liskov Substitution Principle state?",
        codeSnippet: "// A Square extending Rectangle must behave as a Rectangle wherever one is expected",
        correctAnswer: "Subclasses must be substitutable for their parent without breaking behaviour",
        explanation: "LSP requires that objects of a subclass can replace parent-class objects without altering program correctness.",
        options: [
          "Parent classes must never reference child classes",
          "Subclasses must be substitutable for their parent without breaking behaviour",
          "Every subclass method must override the parent",
          "Interfaces must have at least one implementation",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is inversion of control (IoC)?",
        codeSnippet: "// You define handlers; the framework decides when to call them",
        correctAnswer: "A framework controls program flow instead of your application code",
        explanation: "IoC shifts flow control from application code to a container or framework, enabling pluggable, decoupled architectures.",
        options: [
          "Reversing the order of function calls",
          "A framework controls program flow instead of your application code",
          "Inverting boolean conditions to simplify logic",
          "Using callbacks to reverse async order",
        ],
      },

      {
        type: "MCQ",
        prompt: "What distinguishes the module pattern from a plain namespace object?",
        codeSnippet: "const counter = (() => {\n  let count = 0;\n  return { increment: () => ++count, get: () => count };\n})();",
        correctAnswer: "The module pattern uses closure to enforce truly private state",
        explanation: "The module pattern wraps state in a closure so internal variables are inaccessible from outside. A plain namespace exposes all its properties.",
        options: [
          "Module pattern requires class syntax",
          "Namespaces can hold functions; modules cannot",
          "The module pattern uses closure to enforce truly private state",
          "There is no practical difference",
        ],
      }
];
