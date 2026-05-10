import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/redux/hooks";
import { duelResetMatch } from "@/utils/duelSocketCommands";
import { guardDuelAccess } from "@/utils/formatHelpers";
import { logDuel, logNav } from "@/utils/logger";
import type { DuelHomeScreenProps } from "@/types/duelNavigation.types";
import { styles } from "./DuelNavigator.styles";

export function DuelHomeScreen({ navigation }: DuelHomeScreenProps) {
  const duelWins = useAppSelector((s) => s.duel.duelWins);
  const duelLosses = useAppSelector((s) => s.duel.duelLosses);
  const isGuest = useAppSelector((s) => s.session.isGuest);

  useEffect(() => {
    logNav("screen:enter", { screen: "DuelHomeScreen" });
    return () => logNav("screen:leave", { screen: "DuelHomeScreen" });
  }, []);

  // Reset stale duel state every time the user lands on this screen (initial mount + back navigation).
  useEffect(() => {
    return navigation.addListener("focus", duelResetMatch);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Duels</Text>
      <Text style={styles.sub}>Wins / Losses: {duelWins} / {duelLosses}</Text>
      <Pressable
        style={styles.matchBtn}
        onPress={() => {
          guardDuelAccess(
            isGuest,
            () => navigation.getParent()?.getParent()?.navigate("Auth" as never),
            () => { logDuel("matchmaking:start"); duelResetMatch(); navigation.navigate("Matchmaking"); },
          );
        }}
      >
        <Text style={styles.matchLabel}>Find a Match</Text>
      </Pressable>
    </SafeAreaView>
  );
}
