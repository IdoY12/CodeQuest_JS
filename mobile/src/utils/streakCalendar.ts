/** Current time-unit token for streak comparisons and streak-qualifying API payloads. */
export function getStreakCalendarDate(): string {
  return new Date().toLocaleDateString("en-CA");
}
