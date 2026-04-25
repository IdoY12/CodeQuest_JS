import { StyleSheet } from "react-native";
import { colors } from "@/theme/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  offlineBanner: {
    position: "absolute",
    top: 52,
    zIndex: 50,
    left: 12,
    right: 12,
    backgroundColor: "#422006",
    borderWidth: 1,
    borderColor: "rgba(247,223,30,0.25)",
    borderRadius: 12,
    padding: 10,
  },
  offlineText: { color: colors.accent, textAlign: "center", fontWeight: "700" },
  bootstrapBanner: {
    position: "absolute",
    top: 52,
    zIndex: 51,
    left: 12,
    right: 12,
    backgroundColor: "#3b0d0d",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.35)",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  bootstrapText: { color: "#fecaca", textAlign: "center", fontWeight: "600" },
  bootstrapRetry: {
    alignSelf: "center",
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bootstrapRetryLabel: { color: colors.background, fontWeight: "700" },
});
