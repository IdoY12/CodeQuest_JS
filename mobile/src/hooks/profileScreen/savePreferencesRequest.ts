import type { AppDispatch } from "../../store/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { sessionActions } from "../../store/slices/sessionSlice";
import type { CommitmentKey, GoalKey, LevelKey } from "../../types/profile.types";
import { goals, levels } from "../../constants/profilePreferences";

type PrefsResponse = {
  goal: (typeof goals)[number]["key"];
  experienceLevel: (typeof levels)[number]["key"];
  dailyCommitmentMinutes: 10 | 15 | 30;
  notificationsEnabled: boolean;
  pathKey: "BEGINNER" | "ADVANCED";
};

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
    const response = await apiRequest<PrefsResponse>("/user/preferences", {
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
      sessionActions.updatePreferences({
        goal: response.goal,
        experience: response.experienceLevel,
        commitment: String(response.dailyCommitmentMinutes) as CommitmentKey,
        notificationsEnabled: response.notificationsEnabled,
        path: response.pathKey,
      }),
    );
    dispatch(sessionActions.setNotificationsEnabled(response.notificationsEnabled));
    setSaveMessage("Preferences updated.");
  } catch (error) {
    logError("[AUTH]", error, { phase: "save-preferences" });
    setSaveMessage("Could not save preferences right now.");
  }
}
