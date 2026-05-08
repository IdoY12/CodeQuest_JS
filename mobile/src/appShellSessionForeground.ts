import type { MutableRefObject } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { runStreakAppOpen } from "@/redux/streak-slice";
import type { AppDispatch } from "@/redux/store";
import { refreshSessionOrLogoutOnForeground } from "@/utils/appShellPersistence";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { syncDailyPracticeReminder } from "@/utils/dailyGoalNotificationCheck";
import { syncRegisteredStreakFromServer } from "@/utils/syncRegisteredStreakFromServer";

export function attachAppShellSessionForegroundSync(
  appStateRef: MutableRefObject<AppStateStatus>,
  dispatch: AppDispatch,
  accessToken: string | null,
  isAuthenticated: boolean,
  isGuest: boolean,
): () => void {
  const sub = AppState.addEventListener("change", (next) => {
    if (appStateRef.current !== "active" && next === "active") {
      if (isAuthenticated && accessToken) {
        void refreshSessionOrLogoutOnForeground(accessToken, dispatch);
        void syncRegisteredStreakFromServer(dispatch, accessToken);
      }
      if (isGuest) dispatch(runStreakAppOpen({ today: getStreakCalendarDate() }));
      void syncDailyPracticeReminder();
    }
    appStateRef.current = next;
  });
  return () => sub.remove();
}
