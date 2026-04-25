import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SessionState {
  hasHydrated: boolean;
  authChecked: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  studyDateKey: string;
  studySecondsToday: number;
  bootstrapError: string | null;
}

const initialState: SessionState = {
  hasHydrated: false,
  authChecked: false,
  isAuthenticated: false,
  isGuest: true,
  accessToken: null,
  refreshToken: null,
  userId: null,
  studyDateKey: new Date().toLocaleDateString("en-CA"),
  studySecondsToday: 0,
  bootstrapError: null,
};

type SignInPayload = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    hydrateSession: (state, a: PayloadAction<Partial<SessionState> & { hasCompletedOnboarding?: unknown }>) => {
      const { hasCompletedOnboarding: _legacyOnboardingRemoved, ...rest } = a.payload;
      Object.assign(state, rest);
    },
    setHasHydrated: (state, a: PayloadAction<boolean>) => {
      state.hasHydrated = a.payload;
    },
    setAuthChecked: (state, a: PayloadAction<boolean>) => {
      state.authChecked = a.payload;
    },
    addStudySeconds: (state, a: PayloadAction<number>) => {
      const dateKey = new Date().toLocaleDateString("en-CA");
      if (state.studyDateKey !== dateKey) {
        state.studyDateKey = dateKey;
        state.studySecondsToday = 0;
      }
      state.studySecondsToday += a.payload;
    },
    enterGuestMode: (state) => {
      state.isAuthenticated = false;
      state.isGuest = true;
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.bootstrapError = null;
    },
    signIn: (state, a: PayloadAction<SignInPayload>) => {
      state.isAuthenticated = true;
      state.isGuest = false;
      state.userId = a.payload.userId;
      state.accessToken = a.payload.accessToken;
      state.refreshToken = a.payload.refreshToken;
      state.bootstrapError = null;
    },
    setBootstrapError: (state, a: PayloadAction<string | null>) => {
      state.bootstrapError = a.payload;
    },
    signOut: (state) => {
      const h = state.hasHydrated;
      return { ...initialState, hasHydrated: h, authChecked: true };
    },
    updateAccessToken: (state, a: PayloadAction<string>) => { state.accessToken = a.payload; },
  },
});

export const {
  hydrateSession,
  setHasHydrated,
  setAuthChecked,
  addStudySeconds,
  enterGuestMode,
  signIn,
  signOut,
  updateAccessToken,
  setBootstrapError,
} = sessionSlice.actions;
export default sessionSlice.reducer;
