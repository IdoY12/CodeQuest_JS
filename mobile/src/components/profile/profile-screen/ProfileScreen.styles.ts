import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  guestContainer: { flex: 1, backgroundColor: colors.background },
  guestMain: { flex: 1, justifyContent: "center", padding: spacing.xxl, gap: spacing.lg },
  guestHero: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestName: { marginTop: spacing.md, color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "800" },
  guestEmail: { color: colors.textSecondary, marginTop: spacing.xs, textAlign: "center" },
  guestMeta: { color: colors.success, marginTop: spacing.sm, fontWeight: "700" },
  guestCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  guestSection: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "700", marginBottom: spacing.md },
  guestShield: { color: colors.textSecondary, fontSize: fontSize.sm },
  guestBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  guestBtnLbl: { color: "#111", fontWeight: "800" },
});
