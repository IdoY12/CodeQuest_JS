import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const a = StyleSheet.create({
  row: {
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
  rowPress: { opacity: 0.75 },
  chev: { color: colors.textSecondary, fontSize: fontSize.lg },
});
