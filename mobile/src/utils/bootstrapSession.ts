import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "@/redux/store";
import store from "@/redux/store";
import UserService from "@/services/UserService";
import { logError } from "@/utils/logger";
import { enterGuestMode, setAuthChecked } from "@/redux/session-slice";
import { setUserIdentity, updatePreferences, type Commitment } from "@/redux/profile-slice";
import { hydrateXp } from "@/redux/xp-slice";
import { hydrateStreak } from "@/redux/streak-slice";
import { hydrateStats } from "@/redux/duel-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { REDUX_PERSIST_KEY } from "@/utils/hydrateStore";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";

export async function bootstrapSession(dispatch: AppDispatch): Promise<void> {
  dispatch(setAuthChecked(false));
  const token = store.getState().session.accessToken;
  const isAuthed = store.getState().session.isAuthenticated;

  if (!isAuthed || !token) {
    dispatch(enterGuestMode());
    dispatch(setAuthChecked(true));
    return;
  }

  const userService = new UserService(token);

  try {
    const me = await userService.getMe();
    dispatch(setUserIdentity({ email: me.email, username: me.username, avatarUrl: me.avatarUrl ?? null }));
    const userPreferences = await userService.getPreferencesGet();

    if (userPreferences.userGoal && userPreferences.dailyGoalMinutes) {
      dispatch(
        updatePreferences({
          goal: userPreferences.userGoal,
          experienceLevel: userPreferences.experienceLevel,
          commitment: String(userPreferences.dailyGoalMinutes) as Commitment,
          notificationsEnabled: userPreferences.notificationsEnabled,
        }),
      );
    }

    const progress = await userService.getProgressSummary(getStreakCalendarDate());
    dispatch(hydrateXp({ xpTotal: progress.xpTotal, level: progress.level }));
    dispatch(
      hydrateStreak({
        streakCurrent: progress.streakCurrent,
        lastActivityDate: null,
        lastCheckedDate: null,
      }),
    );
    dispatch(
      hydrateStats({
        duelWins: progress.duelWins,
        duelLosses: progress.duelLosses,
        lessonsCompleted: progress.lessonsCompleted,
      }),
    );
  } catch (error) {
    logError("[AUTH]", error, { phase: "bootstrap" });
    await AsyncStorage.removeItem(REDUX_PERSIST_KEY);
    resetStoresAfterLogout(dispatch);
  } finally {
    dispatch(setAuthChecked(true));
  }
}
