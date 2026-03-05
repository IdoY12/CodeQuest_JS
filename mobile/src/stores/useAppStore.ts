import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

type Goal = "JOB" | "WORK" | "FUN" | "PROJECT";
type Experience = "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED";
type Commitment = "10" | "15" | "30";

interface AppState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  hasCompletedOnboarding: boolean;
  username: string;
  email: string;
  goal?: Goal;
  experience?: Experience;
  commitment?: Commitment;
  notificationsEnabled: boolean;
  path: "BEGINNER" | "ADVANCED";
  level: number;
  xpTotal: number;
  streakCurrent: number;
  streakDays: boolean[];
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
  currentLessonId: string;
  lessonExerciseIndex: number;
  lessonAccuracy: number;
  setOnboarding: (goal: Goal, experience: Experience, commitment: Commitment) => void;
  completeOnboarding: (payload: {
    path: "BEGINNER" | "ADVANCED";
    goal: Goal;
    experience: Experience;
    commitment: Commitment;
    notificationsEnabled: boolean;
  }) => void;
  signIn: (payload: {
    userId: string;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    onboardingCompleted: boolean;
    pathKey: "BEGINNER" | "ADVANCED";
    goal?: Goal | null;
    experienceLevel?: Experience | null;
    dailyCommitmentMinutes?: number | null;
    notificationsEnabled?: boolean | null;
  }) => void;
  signOut: () => void;
  addXp: (amount: number) => void;
  setCurrentLesson: (lessonId: string) => void;
  setExerciseIndex: (index: number) => void;
  setLessonAccuracy: (accuracy: number) => void;
  updatePreferences: (payload: {
    goal: Goal;
    experience: Experience;
    commitment: Commitment;
    notificationsEnabled: boolean;
    path: "BEGINNER" | "ADVANCED";
  }) => void;
  toggleSounds: (value?: boolean) => void;
  toggleHaptics: (value?: boolean) => void;
  setNotificationsEnabled: (value: boolean) => void;
}

const memoryStorage = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ?? memoryStorage.get(name) ?? null;
    } catch {
      return memoryStorage.get(name) ?? null;
    }
  },
  setItem: async (name, value) => {
    memoryStorage.set(name, value);
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Keep the in-memory fallback value if native storage is unavailable.
    }
  },
  removeItem: async (name) => {
    memoryStorage.delete(name);
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Best-effort cleanup; fallback storage already cleared.
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userId: null,
      hasCompletedOnboarding: false,
      username: "Coder",
      email: "",
      goal: undefined,
      experience: undefined,
      commitment: "15",
      notificationsEnabled: true,
      path: "BEGINNER",
      level: 1,
      xpTotal: 0,
      streakCurrent: 0,
      streakDays: [true, true, true, true, true, true, false],
      soundsEnabled: true,
      hapticsEnabled: true,
      currentLessonId: "b1-l1",
      lessonExerciseIndex: 0,
      lessonAccuracy: 0,
      setOnboarding: (goal, experience, commitment) =>
        set({
          goal,
          experience,
          commitment,
          path: experience === "ADVANCED" ? "ADVANCED" : "BEGINNER",
        }),
      completeOnboarding: ({ path, goal, experience, commitment, notificationsEnabled }) =>
        set({
          hasCompletedOnboarding: true,
          path,
          goal,
          experience,
          commitment,
          notificationsEnabled,
        }),
      signIn: ({
        userId,
        email,
        username,
        accessToken,
        refreshToken,
        onboardingCompleted,
        pathKey,
        goal,
        experienceLevel,
        dailyCommitmentMinutes,
        notificationsEnabled,
      }) =>
        set({
          isAuthenticated: true,
          userId,
          email,
          username,
          accessToken,
          refreshToken,
          hasCompletedOnboarding: onboardingCompleted,
          path: pathKey,
          goal: goal ?? undefined,
          experience: experienceLevel ?? undefined,
          commitment:
            dailyCommitmentMinutes === 10 || dailyCommitmentMinutes === 15 || dailyCommitmentMinutes === 30
              ? (String(dailyCommitmentMinutes) as Commitment)
              : get().commitment,
          notificationsEnabled: notificationsEnabled ?? true,
        }),
      signOut: () =>
        set({
          isAuthenticated: false,
          userId: null,
          email: "",
          username: "Coder",
          accessToken: null,
          refreshToken: null,
          hasCompletedOnboarding: false,
          goal: undefined,
          experience: undefined,
          commitment: "15",
          notificationsEnabled: true,
          path: "BEGINNER",
          lessonExerciseIndex: 0,
        }),
      addXp: (amount) => {
        const nextXp = get().xpTotal + amount;
        const nextLevel = Math.max(1, Math.floor(nextXp / 250) + 1);
        set({ xpTotal: nextXp, level: nextLevel });
      },
      setCurrentLesson: (lessonId) => set({ currentLessonId: lessonId, lessonExerciseIndex: 0 }),
      setExerciseIndex: (index) => set({ lessonExerciseIndex: index }),
      setLessonAccuracy: (accuracy) => set({ lessonAccuracy: accuracy }),
      updatePreferences: ({ goal, experience, commitment, notificationsEnabled, path }) =>
        set({ goal, experience, commitment, notificationsEnabled, path }),
      toggleSounds: (value) => set({ soundsEnabled: typeof value === "boolean" ? value : !get().soundsEnabled }),
      toggleHaptics: (value) => set({ hapticsEnabled: typeof value === "boolean" ? value : !get().hapticsEnabled }),
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
    }),
    {
      name: "codequest-app-store",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => () => {
        // Intentionally swallow hydration errors to avoid boot-time crashes.
      },
    },
  ),
);
