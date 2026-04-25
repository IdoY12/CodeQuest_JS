export type ExerciseSubmitResponseDto = {
  xpEarned: number;
  explanation: string;
  /** Present when the server updated streak (registered user + valid clientLocalDate on correct XP). */
  streakCurrent?: number;
};
