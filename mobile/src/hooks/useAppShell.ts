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
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { hydrateStoreFromStorage } from "@/utils/hydrateStore";
import { bootstrapSession } from "@/utils/bootstrapSession";
import { logApp, logAuth } from "@/services/logger";
import { runDailyGoalNotificationCheck } from "@/utils/dailyGoalNotificationCheck";
import { useService } from "@/hooks/useService";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";

export const appQueryClient = new QueryClient();

export function useAppShell() {
  const dispatch = useAppDispatcher();
  const auth = useService(AuthService);
  const user = useService(UserService);
  const [isConnected, setIsConnected] = useState(true);
  const hasHydrated = useAppSelector((s) => s.session.hasHydrated);
  const isAuthenticated = useAppSelector((s) => s.session.isAuthenticated);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const notificationsEnabled = useAppSelector((s) => s.profile.notificationsEnabled);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const checkDaily = useCallback(
    () => void runDailyGoalNotificationCheck(user, isAuthenticated, accessToken, notificationsEnabled),
    [accessToken, isAuthenticated, notificationsEnabled, user],
  );

  useEffect(() => {
    logApp("launch");
    registerGlobalErrorHandlers();
    void ensureAppShellNotificationSetup();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
    });
    const n = NetInfo.addEventListener((state) => setIsConnected(Boolean(state.isConnected)));
    const rejUnsub = registerUnhandledRejectionLogger();
    return () => {
      n();
      rejUnsub();
    };
  }, []);

  useEffect(() => {
    void hydrateStoreFromStorage(dispatch);
  }, [dispatch]);
  useEffect(() => {
    if (!hasHydrated) return;
    logAuth("bootstrap:start", { isAuthenticated, hasAccessToken: Boolean(accessToken) });
    void bootstrapSession(dispatch);
  }, [accessToken, dispatch, hasHydrated, isAuthenticated]);
  useEffect(() => {
    if (!hasHydrated) return;
    return subscribeStoreToHybridStorage(store);
  }, [hasHydrated]);
  useEffect(() => {
    void checkDaily();
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.current !== "active" && next === "active") {
        if (isAuthenticated && accessToken) void refreshSessionOrLogoutOnForeground(auth, dispatch);
        void checkDaily();
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [accessToken, auth, checkDaily, dispatch, isAuthenticated]);

  return { isConnected };
}
