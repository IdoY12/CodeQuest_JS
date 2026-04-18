/**
 * Shared pure streak rules (local calendar dates, YYYY-MM-DD).
 * Used by mobile UI helpers and by server/io persistence — single source for rule math.
 */
export type DailyXpStreakPersisted = {
    streakCount: number;
    lastActivityDate: string | null;
    lastCheckedDate: string | null;
};
export declare function calendarDaysBetweenEarlierAndLater(earlierDateOnly: string, laterDateOnly: string): number;
export declare function applyStreakOnAppOpen(state: DailyXpStreakPersisted, today: string): DailyXpStreakPersisted;
/** Streak day only from exercise: yesterday → +1; any other gap or null → start at 1. */
export declare function applyStreakOnQualifyingXp(state: DailyXpStreakPersisted, today: string): DailyXpStreakPersisted;
//# sourceMappingURL=index.d.ts.map