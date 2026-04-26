import type { MutableRefObject } from "react";
import { Alert, type ViewStyle } from "react-native";

export function shuffleLines(lines: string[]): string[] {
  return [...lines].sort(() => Math.random() - 0.5);
}

export function drainRefInt(ref: MutableRefObject<number>): number {
  const value = ref.current;
  ref.current = 0;
  return value;
}

export function exerciseLineList(codeSnippet: string): string[] {
  return codeSnippet.split("\n");
}

/** True when the answer is a 1-based line index into a multi-line snippet (duel bug rounds, some MCQ rows). */
export function lineBugPickHeuristic(prompt: string, codeSnippet: string, correctAnswer: string): boolean {
  const lines = exerciseLineList(codeSnippet);
  const ca = correctAnswer.trim();
  if (lines.length < 2 || !/^\d+$/.test(ca)) return false;
  const n = Number(ca);
  if (n < 1 || n > lines.length) return false;
  return /line|bug/i.test(prompt);
}

export function progressWidthStyle(percent: number): ViewStyle {
  const p = Math.min(100, Math.max(0, percent));
  return { width: `${p}%` };
}

export function guardDuelAccess(isGuest: boolean, onAuth: () => void, onAllowed: () => void): void {
  if (!isGuest) {
    onAllowed();
    return;
  }
  Alert.alert(
    "Account Required",
    "To play 1v1 Duels, you need a free account. Your XP and match history are tied to your account and cannot be saved as a guest.",
    [{ text: "Cancel", style: "cancel" }, { text: "Sign In / Register", onPress: onAuth }],
  );
}
