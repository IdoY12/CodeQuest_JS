export type ExerciseSubmitResponseDto =
  | { isCorrect: true; xpEarned: number; correctAnswer: string; explanation: string }
  | { isCorrect: false; xpEarned: 0 };
