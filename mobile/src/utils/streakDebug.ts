import store from "@/redux/store";
import { resetStreak, runStreakAppOpen } from "@/redux/streak-slice";
import { getStreakCalendarDate, setStreakCalendarDateOverrideForTests } from "@/utils/streakCalendar";

/** Overrides the calendar date used by streak logic until cleared — dev builds only. */
export function simulateDay(targetDate: string): void {
  if (!__DEV__) return;
  setStreakCalendarDateOverrideForTests(targetDate);
  store.dispatch(runStreakAppOpen({ today: getStreakCalendarDate() }));
}

/** Clears streak Redux state, persisted snapshot, and any simulated calendar date — dev builds only. */
export function resetStreakData(): void {
  if (!__DEV__) return;
  setStreakCalendarDateOverrideForTests(null);
  store.dispatch(resetStreak());
}
