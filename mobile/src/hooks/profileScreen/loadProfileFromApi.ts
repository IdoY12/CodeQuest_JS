import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { setUserIdentity, updatePreferences, type Commitment } from "@/redux/profile-slice";
import type UserProfile from "@/models/UserProfile";
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
    const profile = await apiRequest<UserProfile>("/user/profile", { token });
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
