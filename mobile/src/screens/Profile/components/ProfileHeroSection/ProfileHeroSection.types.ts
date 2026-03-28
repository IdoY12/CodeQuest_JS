import type { StatItem } from "@/types/profile.types";

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
