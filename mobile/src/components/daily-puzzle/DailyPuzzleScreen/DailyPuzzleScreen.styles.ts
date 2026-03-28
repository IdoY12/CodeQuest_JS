import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xxl, paddingTop: spacing.giant, gap: spacing.lg },
  title: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: "800" },
  prompt: { color: colors.textSecondary, fontSize: fontSize.md, lineHeight: 28 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.base,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  submitLabel: { color: "#111", fontWeight: "800", fontSize: fontSize.md },
  message: { color: colors.textSecondary, fontSize: fontSize.md, lineHeight: 24 },
  secondaryButton: {
    minHeight: 48,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLabel: { color: colors.textPrimary, fontWeight: "700" },
});
