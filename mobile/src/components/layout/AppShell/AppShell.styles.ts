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
});
