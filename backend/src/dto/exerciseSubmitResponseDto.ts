export type ExerciseSubmitResponseDto = {
  isCorrect: boolean;
  xpEarned: number;
  correctAnswer: string;
  explanation: string;
  /** Present when the server updated streak (registered user + valid clientLocalDate on correct XP). */
  streakCurrent?: number;
};
