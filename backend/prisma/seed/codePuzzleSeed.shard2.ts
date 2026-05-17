export const CODE_PUZZLE_SHARD_2 = [
  {
    orderIndex: 14,
    prompt: "Write a one-line expression that returns the index of value `x` in `arr`, or -1.",
    acceptedAnswers: ["arr.indexOf(x)"],
    testCases: [
      { inputContext: { arr: [10, 20, 30], x: 20 }, expectedOutput: 1 },
      { inputContext: { arr: [10, 20], x: 99 }, expectedOutput: -1 },
      { inputContext: { arr: [5], x: 5 }, expectedOutput: 0 },
    ],
  },
  {
    orderIndex: 15,
    prompt: "Write a one-line expression that returns TRUE if ALL elements in `arr` are positive.",
    acceptedAnswers: ["arr.every(x=>x>0)", "arr.every((x)=>x>0)"],
    testCases: [
      { inputContext: { arr: [1, 2, 10] }, expectedOutput: true },
      { inputContext: { arr: [1, -2, 3] }, expectedOutput: false },
      { inputContext: { arr: [] }, expectedOutput: true },
    ],
  },
  {
    orderIndex: 16,
    prompt: "Write a one-line expression that returns TRUE if ANY element in `arr` is negative.",
    acceptedAnswers: ["arr.some(x=>x<0)", "arr.some((x)=>x<0)"],
    testCases: [
      { inputContext: { arr: [1, -1] }, expectedOutput: true },
      { inputContext: { arr: [1, 2] }, expectedOutput: false },
      { inputContext: { arr: [] }, expectedOutput: false },
    ],
  },
  {
    orderIndex: 17,
    prompt: "Write a one-line expression that returns a NEW array without the first element.",
    acceptedAnswers: ["arr.slice(1)"],
    testCases: [
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: [2, 3] },
      { inputContext: { arr: [9] }, expectedOutput: [] },
      { inputContext: { arr: [] }, expectedOutput: [] },
    ],
  },
  {
    orderIndex: 18,
    prompt: "Write a one-line expression that returns the first element > 10 in `arr`.",
    acceptedAnswers: ["arr.find(x=>x>10)", "arr.find((x)=>x>10)"],
    testCases: [
      { inputContext: { arr: [5, 15, 4] }, expectedOutput: 15 },
      { inputContext: { arr: [-5, 50] }, expectedOutput: 50 },
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: null },
    ],
  },
  {
    orderIndex: 19,
    prompt: "Write a one-line expression that returns `obj` keys as an array.",
    acceptedAnswers: ["Object.keys(obj)"],
    testCases: [
      { inputContext: { obj: { a: 1, b: 2 } }, expectedOutput: ["a", "b"] },
      { inputContext: { obj: { only: true } }, expectedOutput: ["only"] },
      { inputContext: { obj: {} }, expectedOutput: [] },
    ],
  },
  {
    orderIndex: 20,
    prompt: "Write a one-line expression that returns a FLATTENED version of nested array `arr`.",
    acceptedAnswers: ["arr.flat()"],
    testCases: [
      { inputContext: { arr: [[1], [2, 3]] }, expectedOutput: [1, 2, 3] },
      { inputContext: { arr: [[[1]], 2] }, expectedOutput: [[1], 2] },
      { inputContext: { arr: [] }, expectedOutput: [] },
    ],
  },
];
