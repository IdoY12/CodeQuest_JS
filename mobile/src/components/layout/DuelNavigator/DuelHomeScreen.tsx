import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/redux/hooks";
import { useDuelSocket } from "@/hooks/useDuelSocket";
import { logDuel, logNav } from "@/utils/logger";
import type { DuelHomeScreenProps } from "@/types/duelNavigation.types";
import { styles } from "./DuelNavigator.styles";

export function DuelHomeScreen({ navigation }: DuelHomeScreenProps) {
  const { resetDuel } = useDuelSocket();
  const duelRating = useAppSelector((s) => s.duel.duelRating);
  const duelWins = useAppSelector((s) => s.duel.duelWins);
  const duelLosses = useAppSelector((s) => s.duel.duelLosses);
  const duelDraws = useAppSelector((s) => s.duel.duelDraws);
  useEffect(() => {
    logNav("screen:enter", { screen: "DuelHomeScreen" });
    return () => logNav("screen:leave", { screen: "DuelHomeScreen" });
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Duel Rating: {duelRating} RP</Text>
      <Text style={styles.sub}>
        Win/Loss/Draw: {duelWins} / {duelLosses} / {duelDraws}
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Duels</Text>
        <Text style={styles.sub}>vs AsyncNinja · Win · +0.8s faster</Text>
        <Text style={styles.sub}>vs ScopeMaster · Loss · -1.4s slower</Text>
      </View>
      <Pressable
        style={styles.matchBtn}
        onPress={() => {
          logDuel("matchmaking:start");
          resetDuel();
          navigation.navigate("Matchmaking");
        }}
      >
        <Text style={styles.matchLabel}>Find a Match</Text>
      </Pressable>
    </SafeAreaView>
  );
}
