import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "@/redux/store";
import store from "@/redux/store";
import { apiRequest } from "@/services/api";
import { logError } from "@/services/logger";
import { enterGuestMode, setAuthChecked, setOnboardingCompleted } from "@/redux/session-slice";
import { setUserIdentity, updatePreferences, type Commitment } from "@/redux/profile-slice";
import { hydrateXp } from "@/redux/xp-slice";
import { hydrateStreak } from "@/redux/streak-slice";
import { hydrateStats } from "@/redux/duel-slice";
import { REDUX_PERSIST_KEY } from "@/utils/hydrateStore";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";
import type AuthMeResponse from "@/models/AuthMeResponse";
import type ProgressSummary from "@/models/ProgressSummary";
import type UserPreferencesGet from "@/models/UserPreferencesGet";

export async function bootstrapSession(dispatch: AppDispatch): Promise<void> {
  dispatch(setAuthChecked(false));
  const token = store.getState().session.accessToken;
  const isAuthed = store.getState().session.isAuthenticated;
  if (!isAuthed || !token) {
    dispatch(enterGuestMode());
    dispatch(setAuthChecked(true));
    return;
  }

  try {
    const me = await apiRequest<AuthMeResponse>("/auth/me", {
      token,
    });
    dispatch(setUserIdentity({ email: me.email, username: me.username, avatarUrl: me.avatarUrl ?? null }));

    const prefs = await apiRequest<UserPreferencesGet>("/user/preferences", { token });
    dispatch(setOnboardingCompleted(prefs.hasCompletedOnboarding));
    if (prefs.userGoal && prefs.userLevel && prefs.dailyGoalMinutes) {
      dispatch(
        updatePreferences({
          goal: prefs.userGoal,
          experience: prefs.userLevel,
          commitment: String(prefs.dailyGoalMinutes) as Commitment,
          notificationsEnabled: prefs.notificationsEnabled,
          path: prefs.pathKey,
        }),
      );
    }

    const progress = await apiRequest<ProgressSummary>("/user/progress-summary", { token });
    dispatch(hydrateXp({ xpTotal: progress.xpTotal, level: progress.level }));
    dispatch(
      hydrateStreak({
        streakCurrent: progress.streakCurrent,
        streakDays: progress.streakDays,
        streakShieldAvailable: progress.streakShieldAvailable,
      }),
    );
    dispatch(
      hydrateStats({
        duelWins: progress.duelWins,
        duelLosses: progress.duelLosses,
        duelDraws: progress.duelDraws,
        duelRating: progress.duelRating,
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
