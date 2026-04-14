/**
 * Seeds all code puzzle rows from the canonical puzzle list.
 *
 * Responsibility: upsert every CodePuzzle row keyed by orderIndex.
 * Layer: backend prisma seed
 * Depends on: @prisma/client
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";

const puzzles = [
  { orderIndex: 0, prompt: "Write a one-line JS expression that returns the last element of array `arr`.", acceptedAnswers: ["arr[arr.length-1]", "arr.at(-1)"] },
  { orderIndex: 1, prompt: "Write a one-line expression that returns the FIRST element of array `arr`.", acceptedAnswers: ["arr[0]"] },
  { orderIndex: 2, prompt: "Write a one-line expression that returns the LENGTH of string `str`.", acceptedAnswers: ["str.length"] },
  { orderIndex: 3, prompt: "Write a one-line expression that returns `arr` with all elements doubled.", acceptedAnswers: ["arr.map(x=>x*2)", "arr.map((x)=>x*2)"] },
  { orderIndex: 4, prompt: "Write a one-line expression that returns only the EVEN numbers from `arr`.", acceptedAnswers: ["arr.filter(x=>x%2===0)", "arr.filter((x)=>x%2===0)"] },
  { orderIndex: 5, prompt: "Write a one-line expression that returns the SUM of all elements in `arr`.", acceptedAnswers: ["arr.reduce((a,b)=>a+b,0)", "arr.reduce((a, b) => a + b, 0)"] },
  { orderIndex: 6, prompt: "Write a one-line expression that checks if `arr` INCLUDES the number 5.", acceptedAnswers: ["arr.includes(5)"] },
  { orderIndex: 7, prompt: "Write a one-line expression that returns `arr` REVERSED (without mutating).", acceptedAnswers: ["[...arr].reverse()", "arr.slice().reverse()"] },
  { orderIndex: 8, prompt: "Write a one-line expression that returns the LARGEST number in `arr`.", acceptedAnswers: ["Math.max(...arr)"] },
  { orderIndex: 9, prompt: "Write a one-line expression that returns the SMALLEST number in `arr`.", acceptedAnswers: ["Math.min(...arr)"] },
  { orderIndex: 10, prompt: "Write a one-line expression that converts string `str` to UPPERCASE.", acceptedAnswers: ["str.toUpperCase()"] },
  { orderIndex: 11, prompt: "Write a one-line expression that removes WHITESPACE from both ends of `str`.", acceptedAnswers: ["str.trim()"] },
  { orderIndex: 12, prompt: "Write a one-line expression that SPLITS `str` into an array of words.", acceptedAnswers: ["str.split(' ')", "str.split(\" \")"] },
  { orderIndex: 13, prompt: "Write a one-line expression that JOINS array `arr` into a string with commas.", acceptedAnswers: ["arr.join(', ')", "arr.join(\", \")"] },
  { orderIndex: 14, prompt: "Write a one-line expression that returns the index of value `x` in `arr`, or -1.", acceptedAnswers: ["arr.indexOf(x)"] },
  { orderIndex: 15, prompt: "Write a one-line expression that returns TRUE if ALL elements in `arr` are positive.", acceptedAnswers: ["arr.every(x=>x>0)", "arr.every((x)=>x>0)"] },
  { orderIndex: 16, prompt: "Write a one-line expression that returns TRUE if ANY element in `arr` is negative.", acceptedAnswers: ["arr.some(x=>x<0)", "arr.some((x)=>x<0)"] },
  { orderIndex: 17, prompt: "Write a one-line expression that returns a NEW array without the first element.", acceptedAnswers: ["arr.slice(1)"] },
  { orderIndex: 18, prompt: "Write a one-line expression that returns the first element > 10 in `arr`.", acceptedAnswers: ["arr.find(x=>x>10)", "arr.find((x)=>x>10)"] },
  { orderIndex: 19, prompt: "Write a one-line expression that returns `obj` keys as an array.", acceptedAnswers: ["Object.keys(obj)"] },
  { orderIndex: 20, prompt: "Write a one-line expression that returns a FLATTENED version of nested array `arr`.", acceptedAnswers: ["arr.flat()"] },
];

export async function seedCodePuzzles(prisma: PrismaClient): Promise<void> {
  for (const puzzle of puzzles) {
    await prisma.codePuzzle.upsert({
      where: { orderIndex: puzzle.orderIndex },
      update: { prompt: puzzle.prompt, acceptedAnswers: puzzle.acceptedAnswers },
      create: puzzle,
    });
  }
}
