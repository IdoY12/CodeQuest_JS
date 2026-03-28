import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme/theme";

export const exerciseTapTokenStyles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  explanation: { color: colors.textSecondary, lineHeight: 22 },
  option: {
    padding: spacing.md,
    borderRadius: radius.button,
    borderColor: colors.border,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  optionLabel: { color: colors.textPrimary },
  lessonButton: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
    marginTop: spacing.md,
  },
  lessonButtonLabel: { color: "#111", fontWeight: "800" },
  disabled: { opacity: 0.5 },
  feedback: { marginTop: spacing.md, fontWeight: "700" },
  feedbackGood: { color: colors.success },
  feedbackBad: { color: colors.danger },
});
