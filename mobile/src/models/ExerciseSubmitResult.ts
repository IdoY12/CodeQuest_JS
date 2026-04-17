export default interface ExerciseSubmitResult {
  isCorrect: boolean;
  xpEarned: number;
  correctAnswer?: string;
  explanation?: string;
  streakCurrent?: number;
}
