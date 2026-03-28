import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const lessonScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, gap: spacing.lg },
  title: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: "800" },
  chapterDesc: { color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.lg },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: 8, backgroundColor: colors.accent },
  progressText: { color: colors.textSecondary },
  prompt: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "700" },
});
