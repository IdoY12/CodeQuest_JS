import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HydrationLoadingScreen.styles";

/** Shown while persisted Redux state is rehydrating or auth bootstrap is in flight. */
export function HydrationLoadingScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <Text style={styles.text}>Loading...</Text>
    </SafeAreaView>
  );
}
