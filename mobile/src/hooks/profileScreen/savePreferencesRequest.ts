import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { setNotificationsEnabled, updatePreferences } from "@/redux/profile-slice";
import type UserPreferences from "@/models/UserPreferences";
import type { CommitmentKey, GoalKey, LevelKey } from "../../types/profile.types";

export async function patchUserPreferences(
  token: string,
  draftGoal: GoalKey,
  draftLevel: LevelKey,
  draftCommitment: CommitmentKey,
  draftNotifications: boolean,
  dispatch: AppDispatch,
  setSaveMessage: (m: string | null) => void,
): Promise<void> {
  try {
    const response = await apiRequest<UserPreferences>("/user/preferences", {
      method: "PATCH",
      token,
      body: JSON.stringify({
        goal: draftGoal,
        experienceLevel: draftLevel,
        dailyCommitmentMinutes: Number(draftCommitment),
        notificationsEnabled: draftNotifications,
      }),
    });
    dispatch(
      updatePreferences({
        goal: response.goal,
        experience: response.experienceLevel,
        commitment: String(response.dailyCommitmentMinutes) as CommitmentKey,
        notificationsEnabled: response.notificationsEnabled,
        path: response.pathKey,
      }),
    );
    dispatch(setNotificationsEnabled(response.notificationsEnabled));
    setSaveMessage("Preferences updated.");
  } catch (error) {
    logError("[AUTH]", error, { phase: "save-preferences" });
    setSaveMessage("Could not save preferences right now.");
  }
}
