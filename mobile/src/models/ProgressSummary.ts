export default interface ProgressSummary {
  xpTotal: number;
  level: number;
  streakCurrent: number;
  streakDays: boolean[];
  lessonsCompleted: number;
  duelWins: number;
  duelLosses: number;
  duelRating: number;
  streakShieldAvailable: boolean;
}
