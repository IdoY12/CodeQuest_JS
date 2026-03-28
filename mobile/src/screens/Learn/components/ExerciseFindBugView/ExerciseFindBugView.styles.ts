import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const exerciseFindBugStyles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  hearts: { fontSize: fontSize.lg, marginBottom: spacing.sm },
  line: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lineSelected: { borderColor: colors.accent },
  lineText: { color: colors.textPrimary, fontFamily: "monospace" },
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
