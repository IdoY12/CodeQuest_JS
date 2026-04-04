import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xxl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xl,
  },
  secondaryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryPressed: { opacity: 0.85 },
  socialRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  socialIcon: { marginRight: spacing.sm },
  secondaryLabel: { color: colors.textPrimary, fontWeight: "700" },
  terms: { marginTop: spacing.xl, color: colors.textSecondary, fontSize: fontSize.sm, textAlign: "center" },
  switchAuthBtn: { marginTop: spacing.lg, alignItems: "center" },
  switchAuthText: { color: colors.accent, fontWeight: "700" },
});
