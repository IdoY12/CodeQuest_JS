import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";

/** Shown while persisted Redux state is rehydrating or auth bootstrap is in flight. */
export function HydrationLoadingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.textPrimary }}>Loading...</Text>
    </SafeAreaView>
  );
}
