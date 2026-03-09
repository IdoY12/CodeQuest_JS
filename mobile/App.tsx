import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppState, AppStateStatus, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/theme";
import { useAppStore } from "./src/stores/useAppStore";
import { apiRequest, ApiError } from "./src/services/api";
import { logApp, logAuth, logError } from "./src/services/logger";

const queryClient = new QueryClient();

export default function App() {
  const [isConnected, setIsConnected] = React.useState(true);
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const accessToken = useAppStore((s) => s.accessToken);
  const refreshToken = useAppStore((s) => s.refreshToken);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const signOut = useAppStore((s) => s.signOut);
  const setAccessToken = useAppStore((s) => s.setAccessToken);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const setAuthChecked = useAppStore((s) => s.setAuthChecked);
  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);
  const authBootstrappedRef = React.useRef(false);

  React.useEffect(() => {
    logApp("launch");
  }, []);

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
    const maybeErrorUtils = (globalThis as unknown as { ErrorUtils?: { getGlobalHandler?: () => unknown; setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void } }).ErrorUtils;
    if (!maybeErrorUtils?.getGlobalHandler || !maybeErrorUtils?.setGlobalHandler) return;
    const existing = maybeErrorUtils.getGlobalHandler();
    maybeErrorUtils.setGlobalHandler((error, isFatal) => {
      logError("[APP]", error, { isFatal: Boolean(isFatal) });
      if (typeof existing === "function") {
        (existing as (error: Error, isFatal?: boolean) => void)(error, isFatal);
      }
    });
  }, []);

  React.useEffect(() => {
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      logError("[APP]", event.reason, { type: "unhandledrejection" });
    };
    if (typeof addEventListener === "function") {
      addEventListener("unhandledrejection", rejectionHandler as EventListener);
      return () => removeEventListener("unhandledrejection", rejectionHandler as EventListener);
    }
    return undefined;
  }, []);

  React.useEffect(() => {
    if (!hasHydrated || authBootstrappedRef.current) return;
    authBootstrappedRef.current = true;
    const bootstrapAuth = async () => {
      setAuthChecked(false);
      logAuth("bootstrap:start", { isAuthenticated, hasAccessToken: Boolean(accessToken) });
      if (!isAuthenticated || !accessToken) {
        logAuth("bootstrap:skip-unauthenticated");
        setAuthChecked(true);
        return;
      }

      const fetchPreferences = async (token: string) =>
        apiRequest<{
          hasCompletedOnboarding: boolean;
          userGoal: "JOB" | "WORK" | "FUN" | "PROJECT" | null;
          userLevel: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED" | null;
          dailyGoalMinutes: 10 | 15 | 30 | null;
          notificationsEnabled: boolean;
          pathKey: "BEGINNER" | "ADVANCED";
        }>("/user/preferences", { token });

      try {
        const prefs = await fetchPreferences(accessToken);
        setOnboardingCompleted(prefs.hasCompletedOnboarding);
        if (prefs.userGoal && prefs.userLevel && prefs.dailyGoalMinutes) {
          updatePreferences({
            goal: prefs.userGoal,
            experience: prefs.userLevel,
            commitment: String(prefs.dailyGoalMinutes) as "10" | "15" | "30",
            notificationsEnabled: prefs.notificationsEnabled,
            path: prefs.pathKey,
          });
        }
        logAuth("bootstrap:success", { hasCompletedOnboarding: prefs.hasCompletedOnboarding });
        setAuthChecked(true);
      } catch (error) {
        const is401 = error instanceof ApiError && error.status === 401;
        if (is401 && refreshToken) {
          try {
            logAuth("bootstrap:refresh-token");
            const refreshed = await apiRequest<{ accessToken: string }>("/auth/refresh", {
              method: "POST",
              body: JSON.stringify({ refreshToken }),
            });
            setAccessToken(refreshed.accessToken);
            await fetchPreferences(refreshed.accessToken);
            logAuth("bootstrap:refresh-success");
            setAuthChecked(true);
            return;
          } catch (refreshError) {
            logError("[AUTH]", refreshError, { phase: "bootstrap-refresh" });
          }
        }
        signOut();
        logAuth("bootstrap:signout-invalid-session");
      }
      setAuthChecked(true);
    };
    void bootstrapAuth();
  }, [
    accessToken,
    hasHydrated,
    isAuthenticated,
    refreshToken,
    setAccessToken,
    setAuthChecked,
    setOnboardingCompleted,
    signOut,
    updatePreferences,
  ]);

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
      logApp("daily-goal:check");
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
    <SafeAreaProvider>
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
    </SafeAreaProvider>
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
