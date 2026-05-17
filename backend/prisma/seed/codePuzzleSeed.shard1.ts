export const CODE_PUZZLE_SHARD_1 = [
  {
    orderIndex: 7,
    prompt: "Write a one-line expression that returns `arr` REVERSED (without mutating).",
    acceptedAnswers: ["[...arr].reverse()", "arr.slice().reverse()"],
    testCases: [
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: [3, 2, 1] },
      { inputContext: { arr: [1] }, expectedOutput: [1] },
      { inputContext: { arr: [] }, expectedOutput: [] },
    ],
  },
  {
    orderIndex: 8,
    prompt: "Write a one-line expression that returns the LARGEST number in `arr`.",
    acceptedAnswers: ["Math.max(...arr)"],
    testCases: [
      { inputContext: { arr: [1, 5, 2] }, expectedOutput: 5 },
      { inputContext: { arr: [-1, -10] }, expectedOutput: -1 },
      { inputContext: { arr: [42] }, expectedOutput: 42 },
    ],
  },
  {
    orderIndex: 9,
    prompt: "Write a one-line expression that returns the SMALLEST number in `arr`.",
    acceptedAnswers: ["Math.min(...arr)"],
    testCases: [
      { inputContext: { arr: [3, 1, 4] }, expectedOutput: 1 },
      { inputContext: { arr: [-2, -8, 3] }, expectedOutput: -8 },
      { inputContext: { arr: [0] }, expectedOutput: 0 },
    ],
  },
  {
    orderIndex: 10,
    prompt: "Write a one-line expression that converts string `str` to UPPERCASE.",
    acceptedAnswers: ["str.toUpperCase()"],
    testCases: [
      { inputContext: { str: "aBc" }, expectedOutput: "ABC" },
      { inputContext: { str: "" }, expectedOutput: "" },
      { inputContext: { str: "hello" }, expectedOutput: "HELLO" },
    ],
  },
  {
    orderIndex: 11,
    prompt: "Write a one-line expression that removes WHITESPACE from both ends of `str`.",
    acceptedAnswers: ["str.trim()"],
    testCases: [
      { inputContext: { str: "  hi  " }, expectedOutput: "hi" },
      { inputContext: { str: "" }, expectedOutput: "" },
      { inputContext: { str: "x" }, expectedOutput: "x" },
    ],
  },
  {
    orderIndex: 12,
    prompt: "Write a one-line expression that SPLITS `str` into an array of words.",
    acceptedAnswers: ["str.split(' ')", "str.split(\" \")"],
    testCases: [
      { inputContext: { str: "a b c" }, expectedOutput: ["a", "b", "c"] },
      { inputContext: { str: "one" }, expectedOutput: ["one"] },
      { inputContext: { str: "" }, expectedOutput: [""] },
    ],
  },
  {
    orderIndex: 13,
    prompt: "Write a one-line expression that JOINS array `arr` into a string with commas.",
    acceptedAnswers: ["arr.join(', ')", "arr.join(\", \")"],
    testCases: [
      { inputContext: { arr: ["a", "b"] }, expectedOutput: "a, b" },
      { inputContext: { arr: [1, 2, 3] }, expectedOutput: "1, 2, 3" },
      { inputContext: { arr: [] }, expectedOutput: "" },
    ],
  },
];
