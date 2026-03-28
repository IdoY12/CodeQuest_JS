export function normalizePuzzleAnswer(value: string): string {
  return value.replace(/\s+/g, "").trim().replace(/;$/, "");
}

export function isPuzzleResponseCorrect(acceptedAnswers: string[], rawInput: string): boolean {
  const normalizedInput = normalizePuzzleAnswer(rawInput);
  if (!normalizedInput) return false;
  return acceptedAnswers.some((answer) => normalizePuzzleAnswer(answer) === normalizedInput);
}

function dayOfYearUtc(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function pickDailyPuzzleIndex(totalPuzzles: number, date: Date): number {
  const day = dayOfYearUtc(date);
  return ((day % totalPuzzles) + totalPuzzles) % totalPuzzles;
}
