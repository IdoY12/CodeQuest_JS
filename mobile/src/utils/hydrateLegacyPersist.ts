import type { AppDispatch } from "@/redux/store";
import { hydrateSession } from "@/redux/session-slice";
import { hydrateProfile } from "@/redux/profile-slice";
import { hydrateXp } from "@/redux/xp-slice";
import { hydrateStreak } from "@/redux/streak-slice";
import { hydrateStats } from "@/redux/duel-slice";
import { hydratePuzzle } from "@/redux/puzzle-slice";

type OldPersist = { session?: Record<string, unknown>; progress?: Record<string, unknown> };

export async function hydrateLegacySessionProgress(
  dispatch: AppDispatch,
  parsed: OldPersist,
  mergeSessionTokens: (s: Record<string, unknown>) => Promise<Record<string, unknown>>,
): Promise<void> {
  if (!parsed.session || !parsed.progress) return;
  const s = parsed.session;
  const p = parsed.progress;
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
  const legacySessionWithTokens = await mergeSessionTokens(sessionOnly as Record<string, unknown>);
  dispatch(hydrateSession(legacySessionWithTokens as never));
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
