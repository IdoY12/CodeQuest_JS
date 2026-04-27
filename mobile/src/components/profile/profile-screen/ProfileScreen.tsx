import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { commitmentOptions, levels } from "@/constants/learningSettings";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updatePreferences } from "@/redux/profile-slice";
import { logNav } from "@/utils/logger";
import { AuthenticatedProfileScreen } from "../authenticated-profile-screen/AuthenticatedProfileScreen";
import { styles } from "./ProfileScreen.styles";

function GuestProfileBody() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const xp = useAppSelector((s) => s.xp.xpTotal);
  const level = useAppSelector((s) => s.xp.level);
  const experienceLevel = useAppSelector((s) => s.profile.experienceLevel) ?? "JUNIOR";
  const commitment = useAppSelector((s) => s.profile.commitment);
  const goal = useAppSelector((s) => s.profile.goal) ?? "FUN";
  const notificationsEnabled = useAppSelector((s) => s.profile.notificationsEnabled);

  React.useEffect(() => {
    logNav("screen:enter", { screen: "GuestProfileScreen" });
    return () => logNav("screen:leave", { screen: "GuestProfileScreen" });
  }, []);

  const onSignIn = () => {
    navigation.getParent()?.navigate("Auth" as never);
  };

  const onSelectExperience = (nextExperience: "JUNIOR" | "MID" | "SENIOR") => {
    dispatch(
      updatePreferences({
        goal,
        experienceLevel: nextExperience,
        commitment,
        notificationsEnabled,
      }),
    );
  };

  const onSelectCommitment = (nextCommitment: "10" | "15" | "25") => {
    dispatch(
      updatePreferences({
        goal,
        experienceLevel,
        commitment: nextCommitment,
        notificationsEnabled,
      }),
    );
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
        <View style={styles.guestCard}>
          <Text style={styles.guestSection}>Learning Preferences</Text>
          <Text style={styles.guestField}>My JavaScript Level</Text>
          <View style={styles.guestRow}>
            {levels.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => onSelectExperience(item.key)}
                style={[styles.guestChip, experienceLevel === item.key && styles.guestChipOn]}
              >
                <Text style={[styles.guestChipText, experienceLevel === item.key && styles.guestChipTextOn]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.guestField}>Daily Practice Goal</Text>
          <View style={styles.guestRow}>
            {commitmentOptions.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => onSelectCommitment(item.key)}
                style={[styles.guestChip, commitment === item.key && styles.guestChipOn]}
              >
                <Text style={[styles.guestChipText, commitment === item.key && styles.guestChipTextOn]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
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
