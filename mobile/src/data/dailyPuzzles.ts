/**
 * Re-exports daily puzzle helpers from the shared monorepo package.
 *
 * Responsibility: one import path for the mobile daily puzzle screen.
 * Layer: mobile data facade
 * Depends on: @project/daily-puzzles
 * Consumers: DailyPuzzleScreen
 */

export type { DailyPuzzle } from "@project/daily-puzzles";
export {
  dailyPuzzleBank,
  getPuzzleForDate,
  isPuzzleAnswerCorrect,
  normalizePuzzleAnswer,
  pickDailyPuzzleIndex,
} from "@project/daily-puzzles";
