import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { logNav } from "@/services/logger";
import { useAppSelector } from "@/store/hooks";
import { selectLevel, selectXpTotal } from "@/store/selectors";
import { guestProfileScreenStyles } from "./GuestProfileScreen.styles";
import { profileScreenStyles } from "./ProfileScreen.styles";

export function GuestProfileScreen() {
  const navigation = useNavigation();
  const xp = useAppSelector(selectXpTotal);
  const level = useAppSelector(selectLevel);

  React.useEffect(() => {
    logNav("screen:enter", { screen: "GuestProfileScreen" });
    return () => logNav("screen:leave", { screen: "GuestProfileScreen" });
  }, []);

  const onSignIn = () => {
    const root = navigation.getParent()?.getParent();
    root?.navigate("Auth" as never);
  };

  return (
    <SafeAreaView style={profileScreenStyles.container} edges={["top", "bottom"]}>
      <View style={[profileScreenStyles.content, guestProfileScreenStyles.main]}>
        <View style={guestProfileScreenStyles.hero}>
          <Text style={guestProfileScreenStyles.name}>Guest</Text>
          <Text style={guestProfileScreenStyles.email}>Practice locally. Sign in to sync progress and play Duels.</Text>
          <Text style={guestProfileScreenStyles.meta}>
            Level {level} · {xp} XP (on this device)
          </Text>
        </View>
        <View style={guestProfileScreenStyles.card}>
          <Text style={guestProfileScreenStyles.sectionHeader}>Account</Text>
          <Text style={guestProfileScreenStyles.shieldText}>
            Ranked 1v1 Duels require a free account. Your lesson progress is saved on this device until you sign in.
          </Text>
          <Pressable style={guestProfileScreenStyles.saveButton} onPress={onSignIn} accessibilityLabel="Sign in or create account">
            <Text style={guestProfileScreenStyles.saveButtonLabel}>Sign in or create account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
