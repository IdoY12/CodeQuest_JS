import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "@/components/layout/AppNavigator/AppNavigator";
import { styles } from "./AppShell.styles";
import { appQueryClient, useAppShell } from "@/hooks/useAppShell";

export function AppShell() {
  const { isConnected } = useAppShell();

  return (
    // react-native-safe-area-context: exposes notch / status bar / home-indicator insets to descendants (e.g. useSafeAreaInsets). Must wrap the app near the root.
    <SafeAreaProvider>
      <QueryClientProvider client={appQueryClient}>
        <View style={styles.container}>
          {!isConnected && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>You are offline. Continue with cached lessons.</Text>
            </View>
          )}
          <AppNavigator />
          <StatusBar style="light" />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
