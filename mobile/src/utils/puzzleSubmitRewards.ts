import {
  levelFromXpTotal,
  puzzleSolveFeedbackMessage,
  puzzleXpCountFor,
  puzzleXpGrantForSolve,
  type PuzzleXpSolveCounts,
} from "@project/xp-constants";
import type { AppDispatch } from "@/redux/store";
import { incrementPuzzleXpSolveCount } from "@/redux/puzzle-slice";
import { addXp, hydrateXp } from "@/redux/xp-slice";
import { runStreakAppOpen, runStreakQualifyingExercise, hydrateStreak } from "@/redux/streak-slice";
import type { PuzzleSubmitResponse } from "@/services/auth-aware/PuzzleService";

export function applyGuestPuzzleSolve(
  dispatch: AppDispatch,
  puzzleId: number,
  xpSolveCounts: PuzzleXpSolveCounts,
  calendarDate: string,
): string {
  const { grantXp, xpEarned } = puzzleXpGrantForSolve(puzzleXpCountFor(puzzleId, xpSolveCounts));
  dispatch(incrementPuzzleXpSolveCount(puzzleId));
  if (grantXp) {
    dispatch(runStreakAppOpen({ today: calendarDate }));
    dispatch(runStreakQualifyingExercise({ today: calendarDate }));
    dispatch(addXp(xpEarned));
  }
  return puzzleSolveFeedbackMessage(xpEarned);
}

export function applyRegisteredPuzzleSolve(
  dispatch: AppDispatch,
  submitResult: PuzzleSubmitResponse,
  calendarDate: string,
): string {
  const xpEarned = submitResult.xpEarned ?? 0;
  if (typeof submitResult.xpTotal === "number") {
    dispatch(hydrateXp({ xpTotal: submitResult.xpTotal, level: levelFromXpTotal(submitResult.xpTotal) }));
  }
  if (typeof submitResult.streakCurrent === "number") {
    dispatch(
      hydrateStreak({
        streakCurrent: submitResult.streakCurrent,
        lastActivityDate: calendarDate,
        lastCheckedDate: calendarDate,
      }),
    );
  }
  return puzzleSolveFeedbackMessage(xpEarned);
}
