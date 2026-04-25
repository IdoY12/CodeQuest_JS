import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { QueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import {
  ensureAppShellNotificationSetup,
  refreshSessionOrLogoutOnForeground,
  registerGlobalErrorHandlers,
  registerUnhandledRejectionLogger,
  subscribeStoreToHybridStorage,
} from "@/utils/appShellPersistence";
import store from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hydrateStoreFromStorage } from "@/utils/hydrateStore";
import { bootstrapSession } from "@/utils/bootstrapSession";
import { runStreakAppOpen } from "@/redux/streak-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { syncRegisteredStreakFromServer } from "@/utils/syncRegisteredStreakFromServer";
import { logApp, logAuth } from "@/utils/logger";
import { runDailyGoalNotificationCheck } from "@/utils/dailyGoalNotificationCheck";
import { setBootstrapError } from "@/redux/session-slice";

export const appQueryClient = new QueryClient();

export function useAppShell() {
  const dispatch = useAppDispatch();
  const bootstrapError = useAppSelector((s) => s.session.bootstrapError);
  const [isConnected, setIsConnected] = useState(true);
  const hasHydrated = useAppSelector((s) => s.session.hasHydrated);
  const isAuthenticated = useAppSelector((s) => s.session.isAuthenticated);
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const notificationsEnabled = useAppSelector((s) => s.profile.notificationsEnabled);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const checkDaily = useCallback(
    () => void runDailyGoalNotificationCheck(accessToken, isAuthenticated, notificationsEnabled),
    [accessToken, isAuthenticated, notificationsEnabled],
  );

  const retryBootstrap = useCallback(() => {
    dispatch(setBootstrapError(null));
    void bootstrapSession(dispatch);
  }, [dispatch]);

  // This effect acts as the "Grand Opening" of the app shell, running exactly once on mount.
  useEffect(() => {
    // 1. Initial Journal Entry: Record the exact millisecond the application begins its lifecycle.
    logApp("launch");

    // 2. Install "Sync" Protection: This swaps the React Native core error handler (ErrorUtils) 
    // with our recorder. It catches immediate crashes (like calling a function on 'null'). 
    // We do this FIRST so any following startup errors are recorded.
    registerGlobalErrorHandlers();

    // Start the notification setup in the background ("Fire-and-Forget").
    // We use 'void' and NO 'await' because this function might trigger a system popup;
    // we want the app to finish loading the UI immediately instead of waiting for the user to click "Allow".
    void ensureAppShellNotificationSetup();

    // 4. Define the "Receptionist": This configuration tells the OS how to behave 
    // if a notification arrives while the user is actively looking at the app.
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        // Show the alert/banner even if the app is currently in the foreground.
        shouldShowAlert: true,
        // Trigger the notification sound to grab the user's attention.
        shouldPlaySound: true,
        // Do not update the app icon badge (the red number) from this specific handler.
        shouldSetBadge: false,
        // Display the "Heads-up" banner at the top of the screen.
        shouldShowBanner: true,
        // Keep the message inside the system's notification history center.
        shouldShowList: true,
      }),
    });

    // 5. Connectivity Listener: Subscribe to the network status "newsfeed". 
    // We force the state to a strict Boolean to avoid UI confusion during loading.
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => 
      setIsConnected(Boolean(state.isConnected))
    );

    // 6. Install "Async" Protection: Subscribe to the global 'unhandledrejection' event.
    // This catches Promises that failed silently because they were missing a .catch() block.
    const unsubscribeUnhandledRejectionLogger = registerUnhandledRejectionLogger();

    // 7. The Cleanup Ceremony: React runs this when the component is destroyed (unmount).
    return () => {
      // Unsubscribe from network updates to prevent background memory leaks.
      unsubscribeNetInfo();
      // Unsubscribe from the Promise rejection listener to avoid duplicate logs if the app re-initializes.
      unsubscribeUnhandledRejectionLogger();
      
      // Note: We don't "cleanup" the GlobalErrorHandler because it was a 
      // core engine swap that should stay active until the app process ends.
    };
  }, []);

  // This effect runs whenever 'dispatch' changes (usually once on startup).
  useEffect(() => {
    // We fire the hydration process in the background. 
    // 'void' means we don't wait for it here; we just let it run.
    void hydrateStoreFromStorage(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (!hasHydrated) return;
    logAuth("bootstrap:start", { isAuthenticated, hasAccessToken: Boolean(accessToken) });
    if (isGuest) dispatch(runStreakAppOpen({ today: getStreakCalendarDate() }));
    void bootstrapSession(dispatch);
  }, [accessToken, dispatch, hasHydrated, isAuthenticated, isGuest]);

  useEffect(() => {
    if (!hasHydrated) return;
    return subscribeStoreToHybridStorage(store);
  }, [hasHydrated]);

  useEffect(() => {
    void checkDaily();
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.current !== "active" && next === "active") {
        if (isAuthenticated && accessToken) {
          void refreshSessionOrLogoutOnForeground(accessToken, dispatch);
          void syncRegisteredStreakFromServer(dispatch, accessToken);
        }
        if (isGuest) dispatch(runStreakAppOpen({ today: getStreakCalendarDate() }));
        void checkDaily();
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [accessToken, checkDaily, dispatch, isAuthenticated, isGuest]);

  return { isConnected, bootstrapError, retryBootstrap };
}
