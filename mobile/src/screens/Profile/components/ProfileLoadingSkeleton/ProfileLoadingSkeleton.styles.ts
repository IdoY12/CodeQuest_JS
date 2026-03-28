import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme/theme";

export const profileSkeletonStyles = StyleSheet.create({
  skeletonWrap: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  skeletonCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface },
  skeletonLineLg: { width: 180, height: 20, borderRadius: 10, backgroundColor: colors.surface },
  skeletonLineSm: { width: 130, height: 14, borderRadius: 8, backgroundColor: colors.surface },
  skeletonRow: { flexDirection: "row", gap: spacing.sm },
  skeletonCard: { width: 95, height: 70, borderRadius: radius.card, backgroundColor: colors.surface },
});
