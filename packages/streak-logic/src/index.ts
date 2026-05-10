/**
 * Shared pure streak rules.
 * Used by mobile UI helpers and by server/io persistence — single source for rule math.
 */

/** Gap in streak units that triggers a reset or restart (gap >= 2 means one unit was skipped). */
const STREAK_RESET_THRESHOLD = 2;

export type DailyXpStreakPersisted = {
  streakCount: number;
  lastActivityDate: string | null;
  lastCheckedDate: string | null;
};

export function calendarDaysBetweenEarlierAndLater(earlierDateOnly: string, laterDateOnly: string): number {
  return Number(laterDateOnly) - Number(earlierDateOnly);
}

export function applyStreakOnAppOpen(state: DailyXpStreakPersisted, today: string): DailyXpStreakPersisted {
  const missedAppOpenDay =
    state.lastCheckedDate !== null && calendarDaysBetweenEarlierAndLater(state.lastCheckedDate, today) >= STREAK_RESET_THRESHOLD;
  const missedExerciseDay =
    state.lastActivityDate !== null && calendarDaysBetweenEarlierAndLater(state.lastActivityDate, today) >= STREAK_RESET_THRESHOLD;
  const streakCount = missedAppOpenDay || missedExerciseDay ? 0 : state.streakCount;
  return {
    streakCount,
    lastActivityDate: state.lastActivityDate,
    lastCheckedDate: today,
  };
}

export function applyStreakOnQualifyingXp(state: DailyXpStreakPersisted, today: string): DailyXpStreakPersisted {
  if (state.lastActivityDate === today) return state;
  if (state.lastActivityDate === null) {
    return {
      streakCount: 1,
      lastActivityDate: today,
      lastCheckedDate: today,
    };
  }
  const gap = calendarDaysBetweenEarlierAndLater(state.lastActivityDate, today);
  if (gap >= STREAK_RESET_THRESHOLD) {
    return {
      streakCount: 1,
      lastActivityDate: today,
      lastCheckedDate: today,
    };
  }
  return {
    streakCount: state.streakCount + 1,
    lastActivityDate: today,
    lastCheckedDate: today,
  };
}
