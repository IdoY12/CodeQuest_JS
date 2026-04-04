import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { subscribeStoreToHybridStorage } from "@/utils/subscribeReduxPersistToHybridStorage";
import { clearSecureSessionTokens } from "@/utils/secureSessionTokens";
import NetInfo from "@react-native-community/netinfo";
import { QueryClient } from "@tanstack/react-query";
import store from "@/redux/store";
import { apiRequest } from "../services/api";
import { logApp, logAuth, logError } from "../services/logger";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { setUserIdentity } from "@/redux/profile-slice";
import { REDUX_PERSIST_KEY, hydrateStoreFromStorage } from "@/utils/hydrateStore";
import { bootstrapSession } from "@/utils/bootstrapSession";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";
import type AuthMeResponse from "@/models/AuthMeResponse";
import type DailyGoalStatus from "@/models/DailyGoalStatus";

export const appQueryClient = new QueryClient();

export function useAppShell() {
  const dispatch = useAppDispatcher();
  const [isConnected, setIsConnected] = useState(true);
  const hasHydrated = useAppSelector((s) => s.session.hasHydrated);
  const isAuthenticated = useAppSelector((s) => s.session.isAuthenticated);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const notificationsEnabled = useAppSelector((s) => s.profile.notificationsEnabled);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    logApp("launch");
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const maybeErrorUtils = (
      globalThis as unknown as {
        ErrorUtils?: {
          getGlobalHandler?: () => unknown;
          setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void;
        };
      }
    ).ErrorUtils;
    if (!maybeErrorUtils?.getGlobalHandler || !maybeErrorUtils?.setGlobalHandler) return;
    const existing = maybeErrorUtils.getGlobalHandler();
    maybeErrorUtils.setGlobalHandler((error, isFatal) => {
      logError("[APP]", error, { isFatal: Boolean(isFatal) });
      if (typeof existing === "function") {
        (existing as (error: Error, isFatal?: boolean) => void)(error, isFatal);
      }
    });
  }, []);

  useEffect(() => {
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      logError("[APP]", event.reason, { type: "unhandledrejection" });
    };
    if (typeof addEventListener === "function") {
      addEventListener("unhandledrejection", rejectionHandler as EventListener);
      return () => removeEventListener("unhandledrejection", rejectionHandler as EventListener);
    }
    return undefined;
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
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    return subscribeStoreToHybridStorage(store);
  }, [hasHydrated]);

  useEffect(() => {
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

  const checkDailyGoalAndNotify = useCallback(async () => {
    if (!isAuthenticated || !accessToken || !notificationsEnabled) return;
    const now = new Date();
    const dateKey = now.toLocaleDateString("en-CA");
    try {
      logApp("daily-goal:check");
      const status = await apiRequest<DailyGoalStatus>(`/user/daily-goal-status/${dateKey}`, { token: accessToken });

      if (status.shieldConsumedToday) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Streak Shield activated",
            body: "You missed a day, but your shield protected the streak.",
          },
          trigger: null,
        });
      }

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

  useEffect(() => {
    void checkDailyGoalAndNotify();
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appStateRef.current !== "active" && nextState === "active") {
        if (isAuthenticated && accessToken) {
          void apiRequest<AuthMeResponse>("/auth/me", { token: accessToken })
            .then((me) =>
              dispatch(setUserIdentity({ email: me.email, username: me.username, avatarUrl: me.avatarUrl ?? null })),
            )
            .catch(async () => {
              await AsyncStorage.removeItem(REDUX_PERSIST_KEY);
              await clearSecureSessionTokens();
              resetStoresAfterLogout(dispatch);
            });
        }
        void checkDailyGoalAndNotify();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [accessToken, checkDailyGoalAndNotify, dispatch, isAuthenticated]);

  return { isConnected };
}
