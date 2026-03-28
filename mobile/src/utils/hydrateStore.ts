import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "@/redux/store";
import { hydrateSession, setHasHydrated } from "@/redux/session-slice";
import { hydrateProfile } from "@/redux/profile-slice";
import { hydrateXp } from "@/redux/xp-slice";
import { hydrateStreak } from "@/redux/streak-slice";
import { hydrateLesson } from "@/redux/lesson-slice";
import { hydrateStats } from "@/redux/duel-slice";
import { hydratePuzzle } from "@/redux/puzzle-slice";
import { logAuth, logError } from "@/services/logger";

export const REDUX_PERSIST_KEY = "codequest-redux-store";

type OldPersist = {
  session?: Record<string, unknown>;
  progress?: Record<string, unknown>;
};

export async function hydrateStoreFromStorage(dispatch: AppDispatch): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(REDUX_PERSIST_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as OldPersist & {
      profile?: Record<string, unknown>;
      xp?: Record<string, unknown>;
      streak?: Record<string, unknown>;
      lesson?: Record<string, unknown>;
      duel?: Record<string, unknown>;
      puzzle?: Record<string, unknown>;
    };
    if (parsed.profile && parsed.session) {
      dispatch(hydrateSession(parsed.session as never));
      dispatch(hydrateProfile(parsed.profile as never));
      if (parsed.xp) dispatch(hydrateXp(parsed.xp as never));
      if (parsed.streak) dispatch(hydrateStreak(parsed.streak as never));
      if (parsed.lesson) dispatch(hydrateLesson(parsed.lesson as never));
      if (parsed.duel) dispatch(hydrateStats(parsed.duel as never));
      if (parsed.puzzle) dispatch(hydratePuzzle(parsed.puzzle as never));
    } else if (parsed.session && parsed.progress) {
      const s = parsed.session as Record<string, unknown>;
      const p = parsed.progress as Record<string, unknown>;
      const sessionOnly = {
        hasHydrated: s.hasHydrated,
        authChecked: s.authChecked,
        isAuthenticated: s.isAuthenticated,
        isGuest: s.isGuest,
        hasCompletedOnboarding: s.hasCompletedOnboarding,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        userId: s.userId,
      };
      if (s.isAuthenticated && s.accessToken) (sessionOnly as { isGuest: boolean }).isGuest = false;
      else if (typeof s.isGuest !== "boolean") (sessionOnly as { isGuest: boolean }).isGuest = !s.isAuthenticated;
      dispatch(hydrateSession(sessionOnly as never));
      dispatch(
        hydrateProfile({
          username: s.username,
          email: s.email,
          avatarUrl: s.avatarUrl,
          goal: s.goal,
          experience: s.experience,
          commitment: s.commitment,
          path: s.path,
          notificationsEnabled: s.notificationsEnabled,
          soundsEnabled: s.soundsEnabled,
          hapticsEnabled: s.hapticsEnabled,
        } as never),
      );
      dispatch(
        hydrateXp({
          level: p.level,
          xpTotal: p.xpTotal,
          xpMultiplierFactor: p.xpMultiplierFactor,
          xpMultiplierEndsAt: p.xpMultiplierEndsAt,
        } as never),
      );
      dispatch(
        hydrateStreak({
          streakCurrent: p.streakCurrent,
          streakDays: p.streakDays,
          streakShieldAvailable: p.streakShieldAvailable,
        } as never),
      );
      dispatch(
        hydrateStats({
          duelWins: p.duelWins,
          duelLosses: p.duelLosses,
          duelDraws: p.duelDraws,
          duelRating: p.duelRating,
          lessonsCompleted: p.lessonsCompleted,
        } as never),
      );
      dispatch(
        hydratePuzzle({
          lastDailyPuzzleSolvedDate: p.lastDailyPuzzleSolvedDate,
          puzzleSolvedIdByDate: p.puzzleSolvedIdByDate,
        } as never),
      );
    }
  } catch (error) {
    logError("[APP]", error, { phase: "hydrate-redux" });
  } finally {
    dispatch(setHasHydrated(true));
    logAuth("storage:hydrated", { value: true });
  }
}
