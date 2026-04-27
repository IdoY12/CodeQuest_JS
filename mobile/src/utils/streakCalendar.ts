/** Device local calendar date (`en-CA` / ISO-style) for streak-qualifying API payloads. */
export function getStreakCalendarDate(): string {
  return new Date().toLocaleDateString("en-CA");
}
