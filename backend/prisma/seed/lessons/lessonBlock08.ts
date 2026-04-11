/**
 * Seeds one curriculum lesson block (exercises + metadata) into Prisma.
 *
 * Responsibility: isolated lesson createMany for maintainability under file line limits.
 * Layer: backend prisma seed
 * Depends on: ../lib/createLessonWithExercises.js, ../lib/requireChapterId.js
 * Consumers: ../runMain.js
 */

import type { PrismaClient } from "@prisma/client";
import { createLessonWithExercises } from "../lib/createLessonWithExercises.js";
import type { GlobalExerciseOrder } from "../lib/createLessonWithExercises.js";

export async function seedLessonBlock_08(prisma: PrismaClient, order: GlobalExerciseOrder): Promise<void> {
    await createLessonWithExercises(prisma, {
      chapterTitle: "Senior track",
      title: "Async, classes, and concurrency basics",
      description: "Event loop ordering, async/await, and class inheritance",
      estimatedMinutes: 14,
      orderIndex: 2,
      difficulty: "SENIOR",
      exercises: [
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What order is logged?",
          codeSnippet: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));",
          correctAnswer: "A, C, B",
          explanation: "Sync logs first, then microtasks, then macrotasks.",
          xpReward: 25,
          options: ["A, B, C", "A, C, B", "C, A, B", "B, C, A"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does an async function return?",
          codeSnippet: "async function run(){ return 5; }\nconsole.log(run());",
          correctAnswer: "A Promise",
          explanation: "async wraps return values in a Promise.",
          xpReward: 25,
          options: ["5", "undefined", "A Promise", "An object literal"],
        },
        {
          type: "FIND_THE_BUG",
          prompt: "Tap the line with the async bug.",
          codeSnippet: "async function fetchName(){\n  const res = axios.get('/user');\n  return (await res).data;\n}",
          correctAnswer: "2",
          explanation: "axios.get returns a Promise and should be awaited before using the response.",
          xpReward: 25,
          options: ["1", "2", "3", "4"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is printed?",
          codeSnippet: "async function x(){ try { throw new Error('x'); } catch { return 'handled'; } }\nx().then(console.log);",
          correctAnswer: "handled",
          explanation: "The catch block handles the thrown error and returns a value.",
          xpReward: 25,
          options: ["x", "handled", "undefined", "unhandled rejection"],
        },
        {
          type: "TAP_TOKEN",
          prompt: "Choose the missing keyword.",
          codeSnippet: "const user = /* blank */ getUser();",
          correctAnswer: "await",
          explanation: "Use await inside an async function to resolve a Promise result.",
          xpReward: 25,
          options: ["await", "return", "yield", "new"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is logged?",
          codeSnippet: "class User { constructor(name){ this.name = name; } }\nconst u = new User('Sam');\nconsole.log(u.name);",
          correctAnswer: "Sam",
          explanation: "Constructor assigns the name property on instance creation.",
          xpReward: 25,
          options: ["User", "Sam", "undefined", "name"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does extends do?",
          codeSnippet: "class Admin extends User {}",
          correctAnswer: "Creates a subclass that inherits User behavior",
          explanation: "extends links prototype inheritance between classes.",
          xpReward: 25,
          options: [
            "Creates a subclass that inherits User behavior",
            "Copies User values once only",
            "Runs User constructor automatically without super",
            "Disables methods",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What does this print?",
          codeSnippet: "class A { hi(){ return 'A'; } }\nclass B extends A { hi(){ return super.hi() + 'B'; } }\nconsole.log(new B().hi());",
          correctAnswer: "AB",
          explanation: "super.hi() calls the parent method, then appends B.",
          xpReward: 25,
          options: ["A", "B", "AB", "BA"],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "What is a practical limit of parallel `Promise.all` fan-out?",
          codeSnippet: "// launching thousands of network calls at once",
          correctAnswer: "It can overwhelm sockets, memory, and upstream rate limits",
          explanation: "Concurrency should be bounded with pools or semaphores for stability.",
          xpReward: 25,
          options: [
            "JavaScript forbids more than 100 promises",
            "It can overwhelm sockets, memory, and upstream rate limits",
            "Promise.all auto-throttles to 10 tasks",
            "There is no practical downside",
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          prompt: "When is `Atomics.wait` relevant?",
          codeSnippet: "// SharedArrayBuffer + worker threads",
          correctAnswer: "Low-level synchronization on typed array slots in workers",
          explanation: "Atomics coordinates agents sharing memory in advanced concurrency setups.",
          xpReward: 25,
          options: [
            "DOM updates from React",
            "Low-level synchronization on typed array slots in workers",
            "JSON parsing speed",
            "CSS layout thrash prevention",
          ],
        },
      ],
    }, order);
}
