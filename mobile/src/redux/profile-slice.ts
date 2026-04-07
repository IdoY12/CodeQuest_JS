import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Goal = "JOB" | "WORK" | "FUN" | "PROJECT";
export type Experience = "JUNIOR" | "MID" | "SENIOR";
export type Commitment = "10" | "15" | "25";
export type PathKey = "BEGINNER" | "ADVANCED";

type ProfileState = {
  username: string;
  email: string;
  avatarUrl: string | null;
  goal?: Goal;
  experience?: Experience;
  commitment: Commitment;
  path: PathKey;
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
};
const initialState: ProfileState = {
  username: "Coder",
  email: "",
  avatarUrl: null,
  commitment: "15",
  path: "BEGINNER",
  notificationsEnabled: true,
  soundsEnabled: true,
  hapticsEnabled: true,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    hydrateProfile: (state, a: PayloadAction<Partial<ProfileState>>) => void Object.assign(state, a.payload),
    resetProfile: () => initialState,
    setUserIdentity: (state, a: PayloadAction<Partial<Pick<ProfileState, "username" | "email" | "avatarUrl">>>) => {
      if (a.payload.username !== undefined) state.username = a.payload.username;
      if (a.payload.email !== undefined) state.email = a.payload.email;
      if (a.payload.avatarUrl !== undefined) state.avatarUrl = a.payload.avatarUrl;
    },
    setOnboarding: (state, a: PayloadAction<{ goal: Goal; experience: Experience; commitment: Commitment }>) => {
      const { goal, experience, commitment } = a.payload;
      state.goal = goal;
      state.experience = experience;
      state.commitment = commitment;
      state.path = experience === "SENIOR" ? "ADVANCED" : "BEGINNER";
    },
    completeOnboarding: (state, a: PayloadAction<{ path: PathKey; goal: Goal; experience: Experience; commitment: Commitment; notificationsEnabled: boolean }>) => {
      const p = a.payload;
      Object.assign(state, { path: p.path, goal: p.goal, experience: p.experience, commitment: p.commitment, notificationsEnabled: p.notificationsEnabled });
    },
    updatePreferences: (state, a: PayloadAction<{ goal: Goal; experience: Experience; commitment: Commitment; notificationsEnabled: boolean; path: PathKey }>) =>
      void Object.assign(state, a.payload),
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
