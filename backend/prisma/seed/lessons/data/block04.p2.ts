import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block04P2: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "What does `Object.keys(obj)` return?",
        codeSnippet: "const obj = { x: 1, y: 2 };\nconsole.log(Object.keys(obj));",
        correctAnswer: "An array of own enumerable property names",
        explanation: "Object.keys returns an array of the object's own enumerable string-keyed property names.",
        options: [
          "An array of property values",
          "An array of own enumerable property names",
          "An object with swapped keys and values",
          "The number of properties",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does `hasOwnProperty('key')` check?",
        codeSnippet: "const obj = { a: 1 };\nconsole.log(obj.hasOwnProperty('a'));",
        correctAnswer: "Whether the object itself (not its prototype) has that property",
        explanation: "hasOwnProperty only checks properties defined directly on the object, not inherited ones.",
        options: [
          "Whether the object or prototype chain has the property",
          "Whether the property value is truthy",
          "Whether the object itself (not its prototype) has that property",
          "Whether the property is writable",
        ],
      },

      {
        type: "PUZZLE",
        prompt: "Fill in the instance property name to increment the counter.",
        codeSnippet: "class Counter {\n  constructor() { this.count = 0; }\n  increment() { this.___ += 1; }\n}",
        correctAnswer: "count",
        explanation: "this.count refers to the count property set in the constructor.",
        options: ["count", "value", "total", "self"],
      },

      {
        type: "MCQ",
        prompt: "What is an object literal in JavaScript?",
        codeSnippet: "const person = { name: 'Bob', age: 30 };",
        correctAnswer: "A value defined using { key: value } syntax",
        explanation: "Object literals are the most common way to create objects using curly-brace syntax.",
        options: [
          "A string that looks like an object",
          "An object created with Object.create()",
          "A frozen, immutable object",
          "A value defined using { key: value } syntax",
        ],
      }
];
