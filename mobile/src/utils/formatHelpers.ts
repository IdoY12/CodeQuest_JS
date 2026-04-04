import type { MutableRefObject } from "react";
import type { ViewStyle } from "react-native";

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

export function progressWidthStyle(percent: number): ViewStyle {
  const p = Math.min(100, Math.max(0, percent));
  return { width: `${p}%` };
}
