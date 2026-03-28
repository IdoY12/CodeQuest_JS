import { Alert, Linking } from "react-native";

export function openSupportUrl(url: string): void {
  void Linking.openURL(url).catch(() => {
    Alert.alert("Unavailable", "Could not open this link right now.");
  });
}
