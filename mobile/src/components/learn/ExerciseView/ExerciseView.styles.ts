import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme/theme";

export const v = StyleSheet.create({
  root: { flex: 1 },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  explanation: { color: colors.textSecondary, lineHeight: 22 },
  hint: { color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.xs },
  option: {
    padding: spacing.md,
    borderRadius: radius.button,
    borderColor: colors.border,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  optionLabel: { color: colors.textPrimary },
  correct: { borderColor: colors.success, backgroundColor: "rgba(78,205,196,0.2)" },
  wrong: { borderColor: colors.danger, backgroundColor: "rgba(255,107,107,0.2)" },
  // Neutral "selected, not yet checked" indicator so the user can see their tap registered.
  optionSelected: { borderColor: colors.accent },
  lessonButton: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: "center",
    marginTop: spacing.md,
  },
  lessonButtonLabel: { color: "#111", fontWeight: "800" },
  disabled: { opacity: 0.5 },
  feedback: { marginTop: spacing.md, fontWeight: "700", color: colors.textPrimary },
  feedbackGood: { color: colors.success },
  feedbackBad: { color: colors.danger },
});
