export function shuffleLines(lines: string[]): string[] {
  return [...lines].sort(() => Math.random() - 0.5);
}
