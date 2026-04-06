import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/utils/logger";
import { AuthenticatedProfileScreen } from "../authenticated-profile-screen/AuthenticatedProfileScreen";
import { styles } from "./ProfileScreen.styles";

function GuestProfileBody() {
  const navigation = useNavigation();
  const xp = useAppSelector((s) => s.xp.xpTotal);
  const level = useAppSelector((s) => s.xp.level);
  React.useEffect(() => {
    logNav("screen:enter", { screen: "GuestProfileScreen" });
    return () => logNav("screen:leave", { screen: "GuestProfileScreen" });
  }, []);
  const onSignIn = () => {
    const root = navigation.getParent()?.getParent();
    root?.navigate("Auth" as never);
  };
  return (
    <SafeAreaView style={styles.guestContainer} edges={["top", "bottom"]}>
      <View style={styles.guestMain}>
        <View style={styles.guestHero}>
          <Text style={styles.guestName}>Guest</Text>
          <Text style={styles.guestEmail}>Practice locally. Sign in to sync progress and play Duels.</Text>
          <Text style={styles.guestMeta}>
            Level {level} · {xp} XP (on this device)
          </Text>
        </View>
        <View style={styles.guestCard}>
          <Text style={styles.guestSection}>Account</Text>
          <Text style={styles.guestShield}>
            Ranked 1v1 Duels require a free account. Your lesson progress is saved on this device until you sign in.
          </Text>
          <Pressable style={styles.guestBtn} onPress={onSignIn} accessibilityLabel="Sign in or create account">
            <Text style={styles.guestBtnLbl}>Sign in or create account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function ProfileScreen() {
  const isGuest = useAppSelector((s) => s.session.isGuest);
  return (
    <View style={styles.root}>{isGuest ? <GuestProfileBody /> : <AuthenticatedProfileScreen />}</View>
  );
}
