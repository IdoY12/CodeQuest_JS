import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Goal = "JOB" | "WORK" | "FUN" | "PROJECT";
export type Experience = "JUNIOR" | "MID" | "SENIOR";
export type Commitment = "10" | "15" | "25";

type ProfileState = {
  username: string;
  email: string;
  avatarUrl: string | null;
  goal?: Goal;
  experienceLevel?: Experience;
  commitment: Commitment;
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
};

const initialState: ProfileState = {
  username: "Coder",
  email: "",
  avatarUrl: null,
  commitment: "15",
  experienceLevel: "JUNIOR",
  notificationsEnabled: true,
  soundsEnabled: true,
  hapticsEnabled: true,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    hydrateProfile: (
      state,
      a: PayloadAction<Partial<ProfileState> & { path?: Experience; experience?: Experience }>,
    ) => {
      const payload = { ...a.payload };
      if (payload.experienceLevel === undefined) {
        payload.experienceLevel = payload.experience ?? payload.path;
      }
      delete (payload as { path?: unknown }).path;
      delete (payload as { experience?: unknown }).experience;
      Object.assign(state, payload);
    },
    resetProfile: () => initialState,
    setUserIdentity: (state, a: PayloadAction<Partial<Pick<ProfileState, "username" | "email" | "avatarUrl">>>) => {
      if (a.payload.username !== undefined) state.username = a.payload.username;
      if (a.payload.email !== undefined) state.email = a.payload.email;
      if (a.payload.avatarUrl !== undefined) state.avatarUrl = a.payload.avatarUrl;
    },
    setOnboarding: (state, a: PayloadAction<{ goal: Goal; experienceLevel: Experience; commitment: Commitment }>) => {
      const { goal, experienceLevel, commitment } = a.payload;
      state.goal = goal;
      state.experienceLevel = experienceLevel;
      state.commitment = commitment;
    },
    completeOnboarding: (
      state,
      a: PayloadAction<{ experienceLevel: Experience; goal: Goal; commitment: Commitment; notificationsEnabled: boolean }>,
    ) => {
      const p = a.payload;
      Object.assign(state, {
        experienceLevel: p.experienceLevel,
        goal: p.goal,
        commitment: p.commitment,
        notificationsEnabled: p.notificationsEnabled,
      });
    },
    updatePreferences: (
      state,
      a: PayloadAction<{ goal: Goal; experienceLevel: Experience; commitment: Commitment; notificationsEnabled: boolean }>,
    ) => void Object.assign(state, a.payload),
    setNotificationsEnabled: (s, a: PayloadAction<boolean>) => void (s.notificationsEnabled = a.payload),
    toggleSounds: (s, a: PayloadAction<boolean>) => void (s.soundsEnabled = a.payload),
    toggleHaptics: (s, a: PayloadAction<boolean>) => void (s.hapticsEnabled = a.payload),
  },
});

export const {
  hydrateProfile,
  resetProfile,
  setUserIdentity,
  setOnboarding,
  completeOnboarding,
  updatePreferences,
  setNotificationsEnabled,
  toggleSounds,
  toggleHaptics,
} = profileSlice.actions;

export default profileSlice.reducer;
