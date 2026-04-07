import type { StyleProp, TextStyle } from "react-native";

export type GoalKey = "JOB" | "WORK" | "FUN" | "PROJECT";
export type LevelKey = "JUNIOR" | "MID" | "SENIOR";
export type CommitmentKey = "10" | "15" | "25";

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

export type ProfileHeroSectionProps = {
  avatarUrl: string | null;
  initials: string;
  onAvatarPress: () => void;
  username: string;
  email: string;
  level: number;
  duelRating: number;
  duelWinRate: string;
  streakShieldAvailable: boolean;
  uploadingAvatar: boolean;
  uploadProgress: number;
  stats: StatItem[];
};
