import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SessionState {
  hasHydrated: boolean;
  authChecked: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  studyDateKey: string;
  studySecondsToday: number;
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
  studyDateKey: new Date().toLocaleDateString("en-CA"),
  studySecondsToday: 0,
};

type SignInPayload = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  hasCompletedOnboarding: boolean;
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    hydrateSession: (state, a: PayloadAction<Partial<SessionState>>) => {
      Object.assign(state, a.payload);
    },
    setHasHydrated: (state, a: PayloadAction<boolean>) => {
      state.hasHydrated = a.payload;
    },
    setAuthChecked: (state, a: PayloadAction<boolean>) => {
      state.authChecked = a.payload;
    },
    setOnboardingCompleted: (state, a: PayloadAction<boolean>) => {
      state.hasCompletedOnboarding = a.payload;
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
    },
    signIn: (state, a: PayloadAction<SignInPayload>) => {
      state.isAuthenticated = true;
      state.isGuest = false;
      state.userId = a.payload.userId;
      state.accessToken = a.payload.accessToken;
      state.refreshToken = a.payload.refreshToken;
      state.hasCompletedOnboarding = a.payload.hasCompletedOnboarding;
    },
    signOut: (state) => {
      const h = state.hasHydrated;
      return { ...initialState, hasHydrated: h, authChecked: true };
    },
  },
});

export const { hydrateSession, setHasHydrated, setAuthChecked, setOnboardingCompleted, addStudySeconds, enterGuestMode, signIn, signOut } =
  sessionSlice.actions;
export default sessionSlice.reducer;
