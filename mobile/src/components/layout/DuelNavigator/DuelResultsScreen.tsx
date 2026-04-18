import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logNav } from "@/utils/logger";
import { useDuelSocket } from "@/hooks/useDuelSocket";
import type { DuelResultsScreenProps } from "@/types/duelNavigation.types";
import { styles } from "./DuelNavigator.styles";

export function DuelResultsScreen({ route, navigation }: DuelResultsScreenProps) {
  const { won, score, xpEarned, replay = [] } = route.params;
  const { sessionId, rematchStatus, requestRematch, resetDuel, socket } = useDuelSocket();
  const initialSessionIdRef = useRef(sessionId);
  const isWaitingRef = useRef(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => { logNav("screen:enter", { screen: "DuelResultsScreen" }); return () => logNav("screen:leave", { screen: "DuelResultsScreen" }); }, []);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Pressable onPress={() => { resetDuel(); navigation.popToTop(); }}><Text style={styles.secondaryLabel}>Duel</Text></Pressable>,
    });
  }, [navigation, resetDuel]);

  useEffect(() => {
    if (rematchStatus === "opponent_left") { setIsWaiting(false); return; }
    if (isWaiting && sessionId && sessionId !== initialSessionIdRef.current) { setIsWaiting(false); navigation.replace("ActiveDuel"); }
  }, [sessionId, isWaiting, rematchStatus, navigation]);

  useEffect(() => {
    const abandon = () => { if (!isWaitingRef.current && initialSessionIdRef.current) socket?.emit("rematch_abandoned", { session_id: initialSessionIdRef.current }); };
    const unsubRemove = navigation.addListener("beforeRemove", abandon);
    const unsubBlur = navigation.addListener("blur", abandon);
    return () => { unsubRemove(); unsubBlur(); };
  }, [navigation, socket]);

  const goHome = () => { resetDuel(); navigation.popToTop(); };

  if (rematchStatus === "opponent_left") {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <Text style={styles.title}>Opponent left</Text>
        <Pressable style={styles.matchBtn} onPress={goHome}><Text style={styles.matchLabel}>Back to Duel Home</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.duelContent}>
        <Text style={styles.title}>{won ? "Victory!" : "Defeat"}</Text>
        <Text style={styles.sub}>Final score: {score}</Text>
        <Text style={styles.sub}>{won ? "You won this duel." : "You lost this duel."} You earned {xpEarned} XP.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Code Replay</Text>
          {replay.length === 0 ? <Text style={styles.sub}>Replay is unavailable for this duel.</Text> : replay.map((item) => {
            const total = Math.max(1, item.player1TimeMs + item.player2TimeMs);
            return (
              <View key={`replay-${item.roundNumber}`} style={styles.replayRow}>
                <Text style={styles.sub}>Round {item.roundNumber}</Text>
                <View style={styles.replayTrack}>
                  <View style={[styles.replayBarMine, { flex: Math.max(0.25, item.player1TimeMs / total) }]} />
                  <View style={[styles.replayBarOpp, { flex: Math.max(0.25, item.player2TimeMs / total) }]} />
                </View>
              </View>
            );
          })}
        </View>
        <Pressable style={styles.matchBtn} onPress={goHome}><Text style={styles.matchLabel}>Back to Duel Home</Text></Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => { if (sessionId) { isWaitingRef.current = true; setIsWaiting(true); requestRematch(sessionId); } }}>
          <Text style={styles.secondaryLabel}>Play Again</Text>
        </Pressable>
        {isWaiting ? <Text style={styles.searching}>Waiting for opponent to confirm rematch…</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
