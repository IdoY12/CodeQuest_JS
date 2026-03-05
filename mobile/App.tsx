import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppState, AppStateStatus, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/theme";
import { useAppStore } from "./src/stores/useAppStore";
import { apiRequest } from "./src/services/api";

const queryClient = new QueryClient();

export default function App() {
  const [isConnected, setIsConnected] = React.useState(true);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const accessToken = useAppStore((s) => s.accessToken);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);

  React.useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected));
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const prepareNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("practice-reminders", {
          name: "Practice reminders",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
      const permission = await Notifications.getPermissionsAsync();
      if (permission.status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };
    void prepareNotifications();
  }, []);

  const checkDailyGoalAndNotify = React.useCallback(async () => {
    if (!isAuthenticated || !accessToken || !notificationsEnabled) return;
    const now = new Date();
    const dateKey = now.toLocaleDateString("en-CA");
    try {
      const status = await apiRequest<{
        goalMinutes: number;
        practicedMinutes: number;
        remainingMinutes: number;
        canSendIncomplete: boolean;
        canSendComplete: boolean;
      }>(`/user/daily-goal-status/${dateKey}`, { token: accessToken });

      if (status.canSendComplete) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Daily goal crushed!",
            body: `You practiced ${status.practicedMinutes} minutes today. See you tomorrow!`,
          },
          trigger: null,
        });
        await apiRequest(`/user/daily-goal-status/${dateKey}/mark-notified`, {
          method: "POST",
          token: accessToken,
          body: JSON.stringify({ type: "COMPLETE" }),
        });
        return;
      }

      const hour = now.getHours();
      if (hour >= 20 && status.canSendIncomplete && status.remainingMinutes > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Keep your streak alive",
            body: `You're ${status.remainingMinutes} minutes away from your daily goal - jump back in and finish strong!`,
          },
          trigger: null,
        });
        await apiRequest(`/user/daily-goal-status/${dateKey}/mark-notified`, {
          method: "POST",
          token: accessToken,
          body: JSON.stringify({ type: "INCOMPLETE" }),
        });
      }
    } catch {
      // Fail quietly; this should never block the app shell.
    }
  }, [accessToken, isAuthenticated, notificationsEnabled]);

  React.useEffect(() => {
    void checkDailyGoalAndNotify();
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appStateRef.current !== "active" && nextState === "active") {
        void checkDailyGoalAndNotify();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [checkDailyGoalAndNotify]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {!isConnected && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>You are offline. Continue with cached lessons.</Text>
          </View>
        )}
        <RootNavigator />
        <StatusBar style="light" />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  offlineBanner: {
    position: "absolute",
    top: 52,
    zIndex: 50,
    left: 12,
    right: 12,
    backgroundColor: "#422006",
    borderWidth: 1,
    borderColor: "rgba(247,223,30,0.25)",
    borderRadius: 12,
    padding: 10,
  },
  offlineText: { color: colors.accent, textAlign: "center", fontWeight: "700" },
});
