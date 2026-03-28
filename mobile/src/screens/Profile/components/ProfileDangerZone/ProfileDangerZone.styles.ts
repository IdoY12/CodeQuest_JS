import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme/theme";

export const profileDangerStyles = StyleSheet.create({
  dangerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.lg,
  },
  dangerHeader: { color: colors.danger, fontWeight: "800", marginBottom: spacing.md },
  dangerLabel: { color: colors.danger },
  logoutButton: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  logoutLabel: { color: colors.danger, fontWeight: "800" },
});
