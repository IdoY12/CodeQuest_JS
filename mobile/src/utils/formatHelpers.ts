import type { MutableRefObject } from "react";
import { Alert, type ViewStyle } from "react-native";

export function drainRefInt(ref: MutableRefObject<number>): number {
  const value = ref.current;
  ref.current = 0;
  return value;
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
