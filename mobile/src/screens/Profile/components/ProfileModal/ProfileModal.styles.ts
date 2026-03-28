import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const profileModalStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  modalTitle: { color: colors.textPrimary, fontWeight: "800", fontSize: fontSize.md, marginBottom: spacing.md },
  modalText: { color: colors.textSecondary, marginBottom: spacing.md },
  modalInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.button,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, marginTop: spacing.md },
  modalGhost: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  modalGhostText: { color: colors.textSecondary, fontWeight: "700" },
  modalPrimary: {
    backgroundColor: colors.accent,
    borderRadius: radius.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  modalPrimaryText: { color: "#111", fontWeight: "800" },
  modalDanger: {
    backgroundColor: colors.danger,
    borderRadius: radius.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  modalDangerText: { color: colors.background, fontWeight: "800" },
});
