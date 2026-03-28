import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const optionRowStyles = StyleSheet.create({
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  choiceChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  choiceChipSelected: { borderColor: colors.accent, backgroundColor: "rgba(247,223,30,0.15)" },
  choiceChipLabel: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "600" },
  choiceChipLabelSelected: { color: colors.accent },
});
