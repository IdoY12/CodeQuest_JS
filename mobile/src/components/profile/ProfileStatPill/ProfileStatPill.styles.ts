import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const profileStatPillStyles = StyleSheet.create({
  statPill: {
    flex: 1,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  statIcon: { fontSize: fontSize.md },
  statPillValue: { marginTop: spacing.xs, color: colors.textPrimary, fontWeight: "800", fontSize: fontSize.md },
  statPillLabel: { marginTop: spacing.xs, color: colors.textSecondary, fontSize: fontSize.sm },
});
