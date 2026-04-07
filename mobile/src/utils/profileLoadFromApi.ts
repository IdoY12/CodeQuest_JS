import type { AppDispatch } from "@/redux/store";
import type UserService from "@/services/UserService";
import { logError } from "@/utils/logger";
import { setUserIdentity, updatePreferences, type Commitment } from "@/redux/profile-slice";
import type { CommitmentKey, GoalKey, LevelKey } from "@/types/profile.types";

export type DraftSetters = {
  setDraftGoal: (g: GoalKey) => void;
  setDraftLevel: (l: LevelKey) => void;
  setDraftCommitment: (c: CommitmentKey) => void;
  setDraftNotifications: (n: boolean) => void;
};

export function pathFromExperience(level: LevelKey): "BEGINNER" | "ADVANCED" {
  return level === "SENIOR" ? "ADVANCED" : "BEGINNER";
}

export function applyProgressToStore(
  dispatch: AppDispatch,
  goal: GoalKey,
  exp: LevelKey,
  minutes: 10 | 15 | 25,
  notificationsEnabled: boolean,
): void {
  dispatch(
    updatePreferences({
      goal,
      experience: exp,
      commitment: String(minutes) as Commitment,
      notificationsEnabled,
      path: pathFromExperience(exp),
    }),
  );
}

export function syncDraftsFromProgress(
  setters: DraftSetters,
  goal: GoalKey,
  exp: LevelKey,
  minutes: 10 | 15 | 25,
  notificationsEnabled: boolean,
): void {
  setters.setDraftGoal(goal);
  setters.setDraftLevel(exp);
  setters.setDraftCommitment(String(minutes) as CommitmentKey);
  setters.setDraftNotifications(notificationsEnabled);
}

export async function fetchAndApplyProfile(
  user: UserService,
  dispatch: AppDispatch,
  setters: DraftSetters,
  isActive: () => boolean,
): Promise<void> {
  try {
    const profile = await user.getProfile();
    if (!isActive()) return;
    dispatch(
      setUserIdentity({
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
