/**
 * Shared pure streak rules (local calendar dates, YYYY-MM-DD).
 * Used by mobile UI helpers and by server/io persistence — single source for rule math.
 */

export type DailyXpStreakPersisted = {
  streakCount: number;
  lastActivityDate: string | null;
  lastCheckedDate: string | null;
};

export function calendarDaysBetweenEarlierAndLater(earlierDateOnly: string, laterDateOnly: string): number {
  // Split the date strings (YYYY-MM-DD) and convert each part into a number
  const [y1, m1, d1] = earlierDateOnly.split("-").map(Number);
  const [y2, m2, d2] = laterDateOnly.split("-").map(Number);

  // Convert to UTC timestamps. Note: months are 0-indexed in JS (0=Jan, 11=Dec), so we subtract 1
  const start = Date.UTC(y1, m1 - 1, d1);
  const end = Date.UTC(y2, m2 - 1, d2);

  // Calculate the difference in milliseconds and divide by milliseconds in a day (24*60*60*1000)
  return Math.round((end - start) / 86_400_000);
}

export function applyStreakOnAppOpen(state: DailyXpStreakPersisted, today: string): DailyXpStreakPersisted {
  const missedAppOpenDay =
    state.lastCheckedDate !== null && calendarDaysBetweenEarlierAndLater(state.lastCheckedDate, today) >= 2;
  const missedExerciseDay =
    state.lastActivityDate !== null && calendarDaysBetweenEarlierAndLater(state.lastActivityDate, today) >= 2;
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
      lastCheckedDate: state.lastCheckedDate,
    };
  }
  const gap = calendarDaysBetweenEarlierAndLater(state.lastActivityDate, today);
  if (gap >= 2) {
    return {
      streakCount: 1,
      lastActivityDate: today,
      lastCheckedDate: state.lastCheckedDate,
    };
  }
  return {
    streakCount: state.streakCount + 1,
    lastActivityDate: today,
    lastCheckedDate: state.lastCheckedDate,
  };
}
