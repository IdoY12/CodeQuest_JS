/**
 * Builds a seven-day boolean streak view from stored practice date keys.
 *
 * Responsibility: UI-friendly streak strip for progress summary API.
 * Layer: backend user controllers
 * Depends on: none
 * Consumers: getProgressSummaryHandler
 */

export function buildRecentStreakDays(dateKeys: string[], today = new Date()): boolean[] {
  const set = new Set(dateKeys);
  return Array.from({ length: 7 }, (_value, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toLocaleDateString("en-CA");
    return set.has(key);
  });
}
