import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "@/theme/theme";

export const styles = StyleSheet.create({
  container: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginVertical: spacing.lg,
  },
  codeVerticalScroll: { maxHeight: 170 },
  code: {
    color: "#d1d5db",
    fontFamily: "monospace",
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  codeBlock: { padding: spacing.lg },
  output: {
    borderTopWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: "#111827",
  },
  outputTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  outputValue: {
    color: colors.success,
    fontSize: fontSize.base,
    fontFamily: "monospace",
  },
});
