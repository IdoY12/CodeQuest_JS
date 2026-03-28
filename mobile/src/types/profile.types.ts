import type { StyleProp, TextStyle } from "react-native";

export interface ProfilePayload {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  progress: {
    goal: "JOB" | "WORK" | "FUN" | "PROJECT" | null;
    experienceLevel: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED" | null;
    dailyCommitmentMinutes: 10 | 15 | 30 | null;
    notificationsEnabled: boolean;
    onboardingCompleted: boolean;
  } | null;
  duelRating: {
    rating: number;
    wins: number;
    losses: number;
    draws: number;
  } | null;
}

export type GoalKey = "JOB" | "WORK" | "FUN" | "PROJECT";
export type LevelKey = "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED";
export type CommitmentKey = "10" | "15" | "30";

export type OptionRowProps = {
  values: Array<{ key: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
};

export type SettingRowProps = {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  labelStyle?: StyleProp<TextStyle>;
};

export type SupportRowItem = {
  icon: string;
  label: string;
  url: string;
};

export type StatItem = {
  icon: string;
  label: string;
  value: string;
};
