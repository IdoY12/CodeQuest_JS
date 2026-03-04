import React from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { useFonts, Inter_400Regular, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/theme";

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
  });
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected));
    });
    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {!isConnected && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>You are offline. Continue with cached lessons.</Text>
          </View>
        )}
        <RootNavigator />
        <StatusBar style="light" />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
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
