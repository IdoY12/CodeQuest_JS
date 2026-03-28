import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../services/api";
import { logError } from "../services/logger";
import type { RootState } from "./store";
import { progressActions } from "./slices/progressSlice";
import { Commitment, Experience, Goal, PathKey, sessionActions } from "./slices/sessionSlice";

const PERSIST_KEY = "codequest-redux-store";

interface PersistedState {
  session: Partial<RootState["session"]>;
  progress: Partial<RootState["progress"]>;
}
export const hydrateAppState = createAsyncThunk<void, void, { state: RootState }>(
  "app/hydrate",
  async (_, { dispatch }) => {
  try {
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.session) {
        if (parsed.session.isAuthenticated && parsed.session.accessToken) {
          parsed.session.isGuest = false;
        } else if (typeof parsed.session.isGuest !== "boolean") {
          parsed.session.isGuest = !parsed.session.isAuthenticated;
        }
        dispatch(sessionActions.hydrateSession(parsed.session));
      }
      if (parsed.progress) dispatch(progressActions.hydrateProgress(parsed.progress));
    }
  } catch (error) {
    logError("[APP]", error, { phase: "hydrate-redux" });
  } finally {
    dispatch(sessionActions.setHasHydrated(true));
  }
});

type AuthRequest = { mode: "login" | "register"; email: string; password: string; username?: string };
type AuthResponse = {
  user: {
    id: string;
    email: string;
    username: string;
    avatarUrl?: string | null;
    onboardingCompleted: boolean;
    pathKey: PathKey;
    goal?: Goal | null;
    experienceLevel?: Experience | null;
    dailyCommitmentMinutes?: number | null;
    notificationsEnabled?: boolean | null;
  };
  accessToken: string;
  refreshToken: string;
};

export const authenticateUser = createAsyncThunk<void, AuthRequest, { state: RootState }>(
  "session/authenticate",
  async (payload, { dispatch }) => {
    const response = payload.mode === "login"
      ? await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: payload.email, password: payload.password }),
        })
      : await apiRequest<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email: payload.email, username: payload.username, password: payload.password }),
        });

    dispatch(
      sessionActions.signIn({
        userId: response.user.id,
        email: response.user.email,
        username: response.user.username,
        avatarUrl: response.user.avatarUrl,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        onboardingCompleted: response.user.onboardingCompleted,
        pathKey: response.user.pathKey,
        goal: response.user.goal,
        experienceLevel: response.user.experienceLevel,
        dailyCommitmentMinutes: response.user.dailyCommitmentMinutes,
        notificationsEnabled: response.user.notificationsEnabled,
      }),
    );
  },
);

export const bootstrapSession = createAsyncThunk<void, void, { state: RootState }>(
  "session/bootstrap",
  async (_, { dispatch, getState }) => {
    dispatch(sessionActions.setAuthChecked(false));
    const state = getState();
    const token = state.session.accessToken;
    if (!state.session.isAuthenticated || !token) {
      dispatch(sessionActions.enterGuestMode());
      dispatch(sessionActions.setAuthChecked(true));
      return;
    }

    try {
      const me = await apiRequest<{ id: string; email: string; username: string; avatarUrl?: string | null }>(
        "/auth/me",
        { token },
      );
      dispatch(sessionActions.setUserIdentity({ email: me.email, username: me.username, avatarUrl: me.avatarUrl ?? null }));

      const prefs = await apiRequest<{
        hasCompletedOnboarding: boolean;
        userGoal: Goal | null;
        userLevel: Experience | null;
        dailyGoalMinutes: 10 | 15 | 30 | null;
        notificationsEnabled: boolean;
        pathKey: PathKey;
      }>("/user/preferences", { token });
      dispatch(sessionActions.setOnboardingCompleted(prefs.hasCompletedOnboarding));
      if (prefs.userGoal && prefs.userLevel && prefs.dailyGoalMinutes) {
        dispatch(
          sessionActions.updatePreferences({
            goal: prefs.userGoal,
            experience: prefs.userLevel,
            commitment: String(prefs.dailyGoalMinutes) as Commitment,
            notificationsEnabled: prefs.notificationsEnabled,
            path: prefs.pathKey,
          }),
        );
      }

      const progress = await apiRequest<{
        xpTotal: number;
        level: number;
        streakCurrent: number;
        streakDays: boolean[];
        lessonsCompleted: number;
        duelWins: number;
        duelLosses: number;
        duelDraws: number;
        duelRating: number;
        streakShieldAvailable: boolean;
      }>("/user/progress-summary", { token });
      dispatch(progressActions.setProgressSnapshot(progress));
    } catch (error) {
      logError("[AUTH]", error, { phase: "bootstrap" });
      await AsyncStorage.removeItem(PERSIST_KEY);
      dispatch(sessionActions.signOut());
      dispatch(progressActions.resetProgress());
    } finally {
      dispatch(sessionActions.setAuthChecked(true));
    }
  },
);
