import type { SeedExercise } from "../../lib/seedExerciseTypes.js";

export const block04P1: SeedExercise[] = [
      {
        type: "MCQ",
        prompt: "How do you access the `name` property of `obj` using bracket notation?",
        codeSnippet: "const obj = { name: 'Alice' };\n// access with bracket notation",
        correctAnswer: 'obj["name"]',
        explanation: "Bracket notation accepts a string key inside square brackets.",
        options: ['obj["name"]', "obj.(name)", "obj->name", "obj::name"],
      },

      {
        type: "MCQ",
        prompt: "What does `this` refer to inside a regular class method?",
        codeSnippet: "class Dog {\n  bark() { console.log(this.name); }\n}",
        correctAnswer: "The instance the method is called on",
        explanation: "Inside a class method, this refers to the specific object instance on which the method is invoked.",
        options: [
          "The global object",
          "The instance the method is called on",
          "The class constructor function",
          "undefined",
        ],
      },

      {
        type: "MCQ",
        prompt: "Which keyword sets up class inheritance in JavaScript?",
        codeSnippet: "class Puppy ___ Dog { }",
        correctAnswer: "extends",
        explanation: "extends establishes the prototype chain so Puppy inherits Dog's methods.",
        options: ["implements", "extends", "inherits", "derives"],
      },

      {
        type: "MCQ",
        prompt: "What is `super()` used for in a subclass constructor?",
        codeSnippet: "class Puppy extends Dog {\n  constructor(name) {\n    super(name);\n  }\n}",
        correctAnswer: "Calls the parent class constructor",
        explanation: "super() must be called before using this in a subclass constructor; it runs the parent's constructor.",
        options: [
          "Calls the parent class constructor",
          "Creates a static copy of the parent",
          "Accesses the parent's private fields",
          "Calls sibling class methods",
        ],
      },

      {
        type: "MCQ",
        prompt: "What does the `new` keyword do?",
        codeSnippet: "const dog = new Dog('Rex');",
        correctAnswer: "Creates an instance of a class",
        explanation: "new creates a new object, sets its prototype, runs the constructor, and returns the instance.",
        options: [
          "Allocates raw memory",
          "Creates an instance of a class",
          "Declares a new constant binding",
          "Copies an existing object",
        ],
      },

      {
        type: "MCQ",
        prompt: "What is the result of accessing a property that doesn't exist on an object?",
        codeSnippet: "const obj = { a: 1 };\nconsole.log(obj.b);",
        correctAnswer: "undefined",
        explanation: "Accessing a non-existent property returns undefined rather than throwing an error.",
        options: ["null", "TypeError", "undefined", "0"],
      }
];
