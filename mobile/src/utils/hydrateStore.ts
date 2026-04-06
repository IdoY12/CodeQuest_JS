import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "@/redux/store";
import { hydrateSession, setHasHydrated } from "@/redux/session-slice";
import { hydrateProfile } from "@/redux/profile-slice";
import { hydrateXp } from "@/redux/xp-slice";
import { hydrateStreak } from "@/redux/streak-slice";
import { hydrateLesson } from "@/redux/lesson-slice";
import { hydrateStats } from "@/redux/duel-slice";
import { hydratePuzzle } from "@/redux/puzzle-slice";
import { logAuth, logError } from "@/utils/logger";
import { readSecureSessionTokens, writeSecureSessionTokens } from "@/utils/secureSessionTokens";
import { hydrateLegacySessionProgress } from "@/utils/hydrateLegacyPersist";

export const REDUX_PERSIST_KEY = "codequest-redux-store";

type OldPersist = { session?: Record<string, unknown>; progress?: Record<string, unknown> };

async function mergeHydratedSessionTokens<T extends Record<string, unknown>>(session: T) {
  // 1. Get the tokens from the "Vault" (The most reliable source for security).
  const secure = await readSecureSessionTokens();

  // 2. The Logic: "Which token is better?"
  // Priority 1: Use the one from the Secure Vault.
  // Priority 2: If vault is empty, maybe there's one in the Redux backup (session.accessToken).
  // Priority 3: Fallback to null.
  const accessToken = secure.accessToken ?? (session.accessToken as string | null) ?? null;
  const refreshToken = secure.refreshToken ?? (session.refreshToken as string | null) ?? null;

  // 3. Sync: Now that we found the best token, save it back to the vault 
  // to make sure BOTH sources are now identical.
  await writeSecureSessionTokens(accessToken, refreshToken);

  // 4. Return: We combine the original session data with the verified tokens.
  return { ...session, accessToken, refreshToken };
}

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
      const sessionWithTokens = await mergeHydratedSessionTokens(parsed.session as Record<string, unknown>);
      dispatch(hydrateSession(sessionWithTokens as never));
      dispatch(hydrateProfile(parsed.profile as never));
      if (parsed.xp) dispatch(hydrateXp(parsed.xp as never));
      if (parsed.streak) dispatch(hydrateStreak(parsed.streak as never));
      if (parsed.lesson) dispatch(hydrateLesson(parsed.lesson as never));
      if (parsed.duel) dispatch(hydrateStats(parsed.duel as never));
      if (parsed.puzzle) dispatch(hydratePuzzle(parsed.puzzle as never));
    } else {
      await hydrateLegacySessionProgress(dispatch, parsed, mergeHydratedSessionTokens);
    }
  } catch (error) {
    logError("[APP]", error, { phase: "hydrate-redux" });
  } finally {
    dispatch(setHasHydrated(true));
    logAuth("storage:hydrated", { value: true });
  }
}
