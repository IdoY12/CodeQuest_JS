import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Goal = "JOB" | "WORK" | "FUN" | "PROJECT";
export type Experience = "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED";
export type Commitment = "10" | "15" | "30";
export type PathKey = "BEGINNER" | "ADVANCED";

export interface SessionState {
  hasHydrated: boolean;
  authChecked: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  username: string;
  email: string;
  avatarUrl: string | null;
  goal?: Goal;
  experience?: Experience;
  commitment?: Commitment;
  path: PathKey;
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
}

const initialState: SessionState = {
  hasHydrated: false,
  authChecked: false,
  isAuthenticated: false,
  isGuest: true,
  hasCompletedOnboarding: false,
  accessToken: null,
  refreshToken: null,
  userId: null,
  username: "",
  email: "",
  avatarUrl: null,
  path: "BEGINNER",
  notificationsEnabled: true,
  soundsEnabled: true,
  hapticsEnabled: true,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    hydrateSession(state, action: PayloadAction<Partial<SessionState>>) {
      Object.assign(state, action.payload);
    },
    setHasHydrated(state, action: PayloadAction<boolean>) {
      state.hasHydrated = action.payload;
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.authChecked = action.payload;
    },
    enterGuestMode(state) {
      state.isAuthenticated = false;
      state.isGuest = true;
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
    },
    signIn(
      state,
      action: PayloadAction<{
        userId: string;
        email: string;
        username: string;
        avatarUrl?: string | null;
        accessToken: string;
        refreshToken: string;
        onboardingCompleted: boolean;
        pathKey: PathKey;
        goal?: Goal | null;
        experienceLevel?: Experience | null;
        dailyCommitmentMinutes?: number | null;
        notificationsEnabled?: boolean | null;
      }>,
    ) {
      const p = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.userId = p.userId;
      state.email = p.email;
      state.username = p.username;
      state.avatarUrl = p.avatarUrl ?? null;
      state.accessToken = p.accessToken;
      state.refreshToken = p.refreshToken;
      state.hasCompletedOnboarding = p.onboardingCompleted;
      state.path = p.pathKey;
      if (p.goal) state.goal = p.goal;
      if (p.experienceLevel) state.experience = p.experienceLevel;
      if (p.dailyCommitmentMinutes != null) state.commitment = String(p.dailyCommitmentMinutes) as Commitment;
      if (p.notificationsEnabled != null) state.notificationsEnabled = p.notificationsEnabled;
    },
    signOut(state) {
      const hydrated = state.hasHydrated;
      return { ...initialState, hasHydrated: hydrated, authChecked: true };
    },
    setUserIdentity(state, action: PayloadAction<Partial<Pick<SessionState, "email" | "username" | "avatarUrl">>>) {
      if (action.payload.email !== undefined) state.email = action.payload.email;
      if (action.payload.username !== undefined) state.username = action.payload.username;
      if (action.payload.avatarUrl !== undefined) state.avatarUrl = action.payload.avatarUrl;
    },
    setOnboardingCompleted(state, action: PayloadAction<boolean>) {
      state.hasCompletedOnboarding = action.payload;
    },
    updatePreferences(
      state,
      action: PayloadAction<{
        goal: Goal;
        experience: Experience;
        commitment: Commitment;
        notificationsEnabled: boolean;
        path: PathKey;
      }>,
    ) {
      state.goal = action.payload.goal;
      state.experience = action.payload.experience;
      state.commitment = action.payload.commitment;
      state.notificationsEnabled = action.payload.notificationsEnabled;
      state.path = action.payload.path;
    },
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
    },
    setOnboarding(state, action: PayloadAction<{ goal: Goal; experience: Experience; commitment: Commitment }>) {
      state.goal = action.payload.goal;
      state.experience = action.payload.experience;
      state.commitment = action.payload.commitment;
    },
    completeOnboarding(
      state,
      action: PayloadAction<{
        path: PathKey;
        goal: Goal;
        experience: Experience;
        commitment: Commitment;
        notificationsEnabled: boolean;
      }>,
    ) {
      state.hasCompletedOnboarding = true;
      state.path = action.payload.path;
      state.goal = action.payload.goal;
      state.experience = action.payload.experience;
      state.commitment = action.payload.commitment;
      state.notificationsEnabled = action.payload.notificationsEnabled;
    },
    toggleSounds(state, action: PayloadAction<boolean>) {
      state.soundsEnabled = action.payload;
    },
    toggleHaptics(state, action: PayloadAction<boolean>) {
      state.hapticsEnabled = action.payload;
    },
  },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
