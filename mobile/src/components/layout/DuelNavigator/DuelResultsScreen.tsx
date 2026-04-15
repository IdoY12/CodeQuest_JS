import React, { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logNav } from "@/utils/logger";
import type { DuelResultsScreenProps } from "@/types/duelNavigation.types";
import { styles } from "./DuelNavigator.styles";

export function DuelResultsScreen({ route, navigation }: DuelResultsScreenProps) {
  const { won, score } = route.params;
  const replay = route.params.replay ?? [];

  useEffect(() => {
    logNav("screen:enter", { screen: "DuelResultsScreen" });
    return () => logNav("screen:leave", { screen: "DuelResultsScreen" });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.duelContent}>
        <Text style={styles.title}>{won ? "Victory!" : "Defeat"}</Text>
        <Text style={styles.sub}>Final score: {score}</Text>
        <Text style={styles.sub}>{won ? "+50 RP · +100 XP" : "-20 RP · +30 XP"}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Code Replay</Text>
          {replay.length === 0 ? (
            <Text style={styles.sub}>Replay is unavailable for this duel.</Text>
          ) : (
            replay.map((item) => {
              const total = Math.max(1, item.player1TimeMs + item.player2TimeMs);
              const p1Flex = Math.max(0.25, item.player1TimeMs / total);
              const p2Flex = Math.max(0.25, item.player2TimeMs / total);
              return (
                <View key={`replay-${item.roundNumber}`} style={styles.replayRow}>
                  <Text style={styles.sub}>Round {item.roundNumber}</Text>
                  <View style={styles.replayTrack}>
                    <View style={[styles.replayBarMine, { flex: p1Flex }]} />
                    <View style={[styles.replayBarOpp, { flex: p2Flex }]} />
                  </View>
                </View>
              );
            })
          )}
        </View>
        <Pressable style={styles.matchBtn} onPress={() => navigation.navigate("DuelHome")}>
          <Text style={styles.matchLabel}>Back to Duel Home</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => navigation.replace("Matchmaking")}>
          <Text style={styles.secondaryLabel}>Play Again</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
