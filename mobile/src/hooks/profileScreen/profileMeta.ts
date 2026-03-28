import type { StatItem, SupportRowItem } from "../../types/profile.types";

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
