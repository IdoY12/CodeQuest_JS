import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const guestProfileScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  main: { flex: 1, justifyContent: "center", padding: spacing.xxl, gap: spacing.lg },
  hero: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { marginTop: spacing.md, color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "800" },
  email: { color: colors.textSecondary, marginTop: spacing.xs, textAlign: "center" },
  meta: { color: colors.success, marginTop: spacing.sm, fontWeight: "700" },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  sectionHeader: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "700", marginBottom: spacing.md },
  shieldText: { color: colors.textSecondary, fontSize: fontSize.sm },
  saveButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  saveButtonLabel: { color: "#111", fontWeight: "800" },
});
