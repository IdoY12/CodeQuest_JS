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
  const legacySession = parsed.session;
  const legacyProgress = parsed.progress;
  const sessionOnly = {
    hasHydrated: legacySession.hasHydrated,
    authChecked: legacySession.authChecked,
    isAuthenticated: legacySession.isAuthenticated,
    isGuest: legacySession.isGuest,
    accessToken: legacySession.accessToken,
    refreshToken: legacySession.refreshToken,
    userId: legacySession.userId,
  };

  if (legacySession.isAuthenticated && legacySession.accessToken) (sessionOnly as { isGuest: boolean }).isGuest = false;
  else if (typeof legacySession.isGuest !== "boolean") (sessionOnly as { isGuest: boolean }).isGuest = !legacySession.isAuthenticated;

  const legacySessionWithTokens = await mergeSessionTokens(sessionOnly as Record<string, unknown>);
  dispatch(hydrateSession(legacySessionWithTokens as never));
  dispatch(
    hydrateProfile({
      username: legacySession.username,
      email: legacySession.email,
      avatarUrl: legacySession.avatarUrl,
      goal: legacySession.goal,
      experience: legacySession.experience,
      commitment: legacySession.commitment,
      path: legacySession.path,
      notificationsEnabled: legacySession.notificationsEnabled,
      soundsEnabled: legacySession.soundsEnabled,
      hapticsEnabled: legacySession.hapticsEnabled,
    } as never),
  );
  dispatch(
    hydrateXp({
      level: legacyProgress.level,
      xpTotal: legacyProgress.xpTotal,
    } as never),
  );
  dispatch(
    hydrateStreak({
      streakCurrent: legacyProgress.streakCurrent,
      streakDays: legacyProgress.streakDays,
    } as never),
  );
  dispatch(
    hydrateStats({
      duelWins: legacyProgress.duelWins,
      duelLosses: legacyProgress.duelLosses,
      duelRating: legacyProgress.duelRating,
      lessonsCompleted: legacyProgress.lessonsCompleted,
    } as never),
  );
  dispatch(
    hydratePuzzle({
      lastCodePuzzleSolvedDate: legacyProgress.lastCodePuzzleSolvedDate as string | null,
      puzzleSolvedIdByDate: legacyProgress.puzzleSolvedIdByDate as Record<string, string>,
    }),
  );
}
