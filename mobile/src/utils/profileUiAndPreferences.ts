import { Alert, Linking } from "react-native";
import type { AppDispatch } from "@/redux/store";
import type UserService from "@/services/UserService";
import { logError } from "@/utils/logger";
import { setNotificationsEnabled, updatePreferences } from "@/redux/profile-slice";
import type { CommitmentKey, GoalKey, LevelKey, StatItem, SupportRowItem } from "@/types/profile.types";

type StatsSource = { streakCurrent: number; xp: number; lessonsCompleted: number };

export function profileStatsFromRedux(r: StatsSource): StatItem[] {
  return [
    { icon: "🔥", label: "Streak", value: `${r.streakCurrent}d` },
    { icon: "⚡", label: "XP", value: String(r.xp) },
    { icon: "📚", label: "Lessons", value: String(r.lessonsCompleted) },
  ];
}

export function profileSupportRows(): SupportRowItem[] {
  return [
    { icon: "❓", label: "Help Center", url: "https://docs.expo.dev" },
    { icon: "⭐", label: "Rate the App", url: "https://apps.apple.com" },
    { icon: "🔐", label: "Privacy Policy", url: "https://docs.expo.dev/privacy/" },
  ];
}

export function profileInitials(username: string): string {
  return (username || "C").trim().charAt(0).toUpperCase();
}

export function showLanguageComingSoon(): void {
  Alert.alert("Language", "Language selection is coming soon.");
}

export function showThemeComingSoon(): void {
  Alert.alert("Theme", "Theme selection is coming soon.");
}

export function openSupportUrl(url: string): void {
  void Linking.openURL(url).catch(() => Alert.alert("Unavailable", "Could not open this link right now."));
}

export async function patchUserPreferences(
  user: UserService,
  draftGoal: GoalKey,
  draftLevel: LevelKey,
  draftCommitment: CommitmentKey,
  draftNotifications: boolean,
  dispatch: AppDispatch,
  setSaveMessage: (m: string | null) => void,
): Promise<void> {
  try {
    const response = await user.patchPreferences({
      goal: draftGoal,
      experienceLevel: draftLevel,
      dailyCommitmentMinutes: Number(draftCommitment),
      notificationsEnabled: draftNotifications,
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
