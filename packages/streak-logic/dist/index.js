/**
 * Shared pure streak rules (local calendar dates, YYYY-MM-DD).
 * Used by mobile UI helpers and by server/io persistence — single source for rule math.
 */
export function calendarDaysBetweenEarlierAndLater(earlierDateOnly, laterDateOnly) {
    const [y1, m1, d1] = earlierDateOnly.split("-").map(Number);
    const [y2, m2, d2] = laterDateOnly.split("-").map(Number);
    const start = Date.UTC(y1, m1 - 1, d1);
    const end = Date.UTC(y2, m2 - 1, d2);
    return Math.round((end - start) / 86_400_000);
}
export function applyStreakOnAppOpen(state, today) {
    const missedAppOpenDay = state.lastCheckedDate !== null && calendarDaysBetweenEarlierAndLater(state.lastCheckedDate, today) >= 2;
    const missedExerciseDay = state.lastActivityDate !== null && calendarDaysBetweenEarlierAndLater(state.lastActivityDate, today) >= 2;
    const streakCount = missedAppOpenDay || missedExerciseDay ? 0 : state.streakCount;
    return {
        streakCount,
        lastActivityDate: state.lastActivityDate,
        lastCheckedDate: today,
    };
}
/** Streak day only from exercise: yesterday → +1; any other gap or null → start at 1. */
export function applyStreakOnQualifyingXp(state, today) {
    if (state.lastActivityDate === today)
        return state;
    if (state.lastActivityDate === null) {
        return {
            streakCount: 1,
            lastActivityDate: today,
            lastCheckedDate: state.lastCheckedDate,
        };
    }
    const gap = calendarDaysBetweenEarlierAndLater(state.lastActivityDate, today);
    if (gap === 1) {
        return {
            streakCount: state.streakCount + 1,
            lastActivityDate: today,
            lastCheckedDate: state.lastCheckedDate,
        };
    }
    return {
        streakCount: 1,
        lastActivityDate: today,
        lastCheckedDate: state.lastCheckedDate,
    };
}
