import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const l = StyleSheet.create({
  optRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipOn: { borderColor: colors.accent, backgroundColor: "rgba(247,223,30,0.15)" },
  chipTxt: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "600" },
  chipTxtOn: { color: colors.accent },
});
