/** Injected date for tests and dev `simulateDay`; production uses the device local calendar. */
let calendarDateOverride: string | null = null;

export function getStreakCalendarDate(): string {
  return calendarDateOverride ?? new Date().toLocaleDateString("en-CA");
}

/** @internal Used by unit tests and dev utilities — not for production call sites. */
export function setStreakCalendarDateOverrideForTests(isoDateOnly: string | null): void {
  calendarDateOverride = isoDateOnly;
}
