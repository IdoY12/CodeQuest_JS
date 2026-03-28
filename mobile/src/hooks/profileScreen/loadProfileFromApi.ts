import type { AppDispatch } from "../../store/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { sessionActions } from "../../store/slices/sessionSlice";
import type { ProfilePayload } from "../../types/profile.types";
import type { CommitmentKey, GoalKey, LevelKey } from "../../types/profile.types";

export type DraftSetters = {
  setDraftGoal: (g: GoalKey) => void;
  setDraftLevel: (l: LevelKey) => void;
  setDraftCommitment: (c: CommitmentKey) => void;
  setDraftNotifications: (n: boolean) => void;
};

export function pathFromExperience(level: LevelKey): "BEGINNER" | "ADVANCED" {
  const beginner = level === "BEGINNER" || level === "BASICS";
  return beginner ? "BEGINNER" : "ADVANCED";
}

export function applyProgressToStore(
  dispatch: AppDispatch,
  goal: GoalKey,
  exp: LevelKey,
  minutes: 10 | 15 | 30,
  notificationsEnabled: boolean,
): void {
  dispatch(
    sessionActions.updatePreferences({
      goal,
      experience: exp,
      commitment: String(minutes) as CommitmentKey,
      notificationsEnabled,
      path: pathFromExperience(exp),
    }),
  );
}

export function syncDraftsFromProgress(
  setters: DraftSetters,
  goal: GoalKey,
  exp: LevelKey,
  minutes: 10 | 15 | 30,
  notificationsEnabled: boolean,
): void {
  setters.setDraftGoal(goal);
  setters.setDraftLevel(exp);
  setters.setDraftCommitment(String(minutes) as CommitmentKey);
  setters.setDraftNotifications(notificationsEnabled);
}

export async function fetchAndApplyProfile(
  token: string,
  dispatch: AppDispatch,
  setters: DraftSetters,
  isActive: () => boolean,
): Promise<void> {
  try {
    const profile = await apiRequest<ProfilePayload>("/user/profile", { token });
    if (!isActive()) return;
    dispatch(
      sessionActions.setUserIdentity({
        username: profile.username,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
      }),
    );
    const p = profile.progress;
    if (!p?.goal || !p.experienceLevel || !p.dailyCommitmentMinutes) return;
    applyProgressToStore(dispatch, p.goal, p.experienceLevel, p.dailyCommitmentMinutes, p.notificationsEnabled);
    syncDraftsFromProgress(setters, p.goal, p.experienceLevel, p.dailyCommitmentMinutes, p.notificationsEnabled);
  } catch (error) {
    logError("[PROFILE]", error, { phase: "load-profile" });
  }
}
