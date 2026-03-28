import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const settingRowStyles = StyleSheet.create({
  settingRow: {
    minHeight: 52,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingPressed: { opacity: 0.75 },
  chevron: { color: colors.textSecondary, fontSize: fontSize.lg },
});
