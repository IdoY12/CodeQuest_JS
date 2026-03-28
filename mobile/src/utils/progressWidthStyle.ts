import type { ViewStyle } from "react-native";

export function progressWidthStyle(percent: number): ViewStyle {
  const p = Math.min(100, Math.max(0, percent));
  return { width: `${p}%` };
}
