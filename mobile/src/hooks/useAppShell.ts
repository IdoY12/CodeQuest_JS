import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { QueryClient } from "@tanstack/react-query";
import { attachAppShellForegroundInfrastructure } from "@/appShellForegroundSetup";
import { attachAppShellSessionForegroundSync } from "@/appShellSessionForeground";
import store from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { bootstrapSession } from "@/utils/bootstrapSession";
import { hydrateStoreFromStorage } from "@/utils/hydrateStore";
import { runStreakAppOpen } from "@/redux/streak-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { logAuth } from "@/utils/logger";
import { subscribeStoreToHybridStorage } from "@/utils/appShellPersistence";
import { syncDailyPracticeReminder } from "@/utils/dailyGoalNotificationCheck";
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
  const commitment = useAppSelector((s) => s.profile.commitment);
  const notificationsEnabled = useAppSelector((s) => s.profile.notificationsEnabled);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const retryBootstrap = useCallback(() => {
    dispatch(setBootstrapError(null));
    void bootstrapSession(dispatch);
  }, [dispatch]);

  useEffect(() => attachAppShellForegroundInfrastructure(setIsConnected), []);

  useEffect(() => {
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
    if (!hasHydrated) return;
    void syncDailyPracticeReminder();
  }, [hasHydrated, isGuest, isAuthenticated, commitment, notificationsEnabled]);

  useEffect(() => {
    if (!hasHydrated) return;
    return attachAppShellSessionForegroundSync(appStateRef, dispatch, accessToken, isAuthenticated, isGuest);
  }, [hasHydrated, dispatch, accessToken, isAuthenticated, isGuest]);

  return { isConnected, bootstrapError, retryBootstrap };
}
