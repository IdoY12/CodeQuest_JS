import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme/theme";

export const exerciseConceptStyles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  explanation: { color: colors.textSecondary, lineHeight: 22 },
  lessonButton: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
    marginTop: spacing.md,
  },
  lessonButtonLabel: { color: "#111", fontWeight: "800" },
});
