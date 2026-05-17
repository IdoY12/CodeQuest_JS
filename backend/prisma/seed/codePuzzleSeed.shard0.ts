export const CODE_PUZZLE_SHARD_0 = [
  {
    orderIndex: 0,
    prompt: "Write a one-line JS expression that returns the last element of array `arr`.",
    acceptedAnswers: ["arr[arr.length-1]", "arr.at(-1)"],
    testCases: [
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: 3 },
      { inputContext: { arr: [99] }, expectedOutput: 99 },
      { inputContext: { arr: [-1, 0, 2] }, expectedOutput: 2 },
    ],
  },
  {
    orderIndex: 1,
    prompt: "Write a one-line expression that returns the FIRST element of array `arr`.",
    acceptedAnswers: ["arr[0]"],
    testCases: [
      { inputContext: { arr: [7, 8, 9] }, expectedOutput: 7 },
      { inputContext: { arr: [-5, 1] }, expectedOutput: -5 },
      { inputContext: { arr: [0] }, expectedOutput: 0 },
    ],
  },
  {
    orderIndex: 2,
    prompt: "Write a one-line expression that returns the LENGTH of string `str`.",
    acceptedAnswers: ["str.length"],
    testCases: [
      { inputContext: { str: "hello" }, expectedOutput: 5 },
      { inputContext: { str: "" }, expectedOutput: 0 },
      { inputContext: { str: " " }, expectedOutput: 1 },
    ],
  },
  {
    orderIndex: 3,
    prompt: "Write a one-line expression that returns `arr` with all elements doubled.",
    acceptedAnswers: ["arr.map(x=>x*2)", "arr.map((x)=>x*2)"],
    testCases: [
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: [2, 4, 6] },
      { inputContext: { arr: [0] }, expectedOutput: [0] },
      { inputContext: { arr: [] }, expectedOutput: [] },
    ],
  },
  {
    orderIndex: 4,
    prompt: "Write a one-line expression that returns only the EVEN numbers from `arr`.",
    acceptedAnswers: ["arr.filter(x=>x%2===0)", "arr.filter((x)=>x%2===0)"],
    testCases: [
      { inputContext: { arr: [1, 2, 3, 4] }, expectedOutput: [2, 4] },
      { inputContext: { arr: [1, 3, 5] }, expectedOutput: [] },
      { inputContext: { arr: [] }, expectedOutput: [] },
    ],
  },
  {
    orderIndex: 5,
    prompt: "Write a one-line expression that returns the SUM of all elements in `arr`.",
    acceptedAnswers: ["arr.reduce((a,b)=>a+b,0)", "arr.reduce((a, b) => a + b, 0)"],
    testCases: [
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: 6 },
      { inputContext: { arr: [0] }, expectedOutput: 0 },
      { inputContext: { arr: [-1, 3] }, expectedOutput: 2 },
    ],
  },
  {
    orderIndex: 6,
    prompt: "Write a one-line expression that checks if `arr` INCLUDES the number 5.",
    acceptedAnswers: ["arr.includes(5)"],
    testCases: [
      { inputContext: { arr: [1, 5, 2] }, expectedOutput: true },
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: false },
      { inputContext: { arr: [5] }, expectedOutput: true },
    ],
  },
];
