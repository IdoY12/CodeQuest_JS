import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/redux/hooks";
import { useDuelSocket } from "@/hooks/useDuelSocket";
import { logDuel, logNav } from "@/utils/logger";
import type { MatchmakingScreenProps } from "@/types/duelNavigation.types";
import { styles } from "./DuelNavigator.styles";

const QUEUE_TIMER_INTERVAL_MS = 1000;
const MOCK_MATCH_TIMEOUT_MS = 20000;
const MATCH_COUNTDOWN_TICK_MS = 700;
const FALLBACK_PLAYERS_ONLINE = 143;

export function DuelMatchmakingScreen({ navigation }: MatchmakingScreenProps) {
  const { playersOnline, sessionId, opponent, joinQueue, leaveQueue, startLocalMockMatch } = useDuelSocket();
  const userId = useAppSelector((s) => s.session.userId);
  const username = useAppSelector((s) => s.profile.username);
  const duelRating = useAppSelector((s) => s.duel.duelRating);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const [seconds, setSeconds] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const hasJoinedQueueRef = React.useRef(false);
  useEffect(() => {
    logNav("screen:enter", { screen: "MatchmakingScreen" });
    return () => logNav("screen:leave", { screen: "MatchmakingScreen" });
  }, []);
  useEffect(() => {
    if (!userId || hasJoinedQueueRef.current) return;
    hasJoinedQueueRef.current = true;
    joinQueue({ userId, username, rating: duelRating, token: accessToken });
    logDuel("queue:join", { userId });
    const interval = setInterval(() => setSeconds((v) => v + 1), QUEUE_TIMER_INTERVAL_MS);
    const timeout = setTimeout(() => {
      if (!sessionId) startLocalMockMatch();
    }, MOCK_MATCH_TIMEOUT_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      logDuel("queue:leave", { userId: userId ?? "unknown" });
      leaveQueue();
      hasJoinedQueueRef.current = false;
    };
  }, [accessToken, duelRating, joinQueue, leaveQueue, startLocalMockMatch, userId, username]);
  useEffect(() => {
    if (sessionId && opponent) {
      const timer = setInterval(() => setCountdown((value) => Math.max(0, value - 1)), MATCH_COUNTDOWN_TICK_MS);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [sessionId, opponent]);
  useEffect(() => {
    if (sessionId && opponent && countdown === 0) navigation.replace("ActiveDuel");
  }, [countdown, navigation, opponent, sessionId]);
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.searching}>Searching for an opponent...</Text>
      <Text style={styles.sub}>⚡ {playersOnline || FALLBACK_PLAYERS_ONLINE} players online</Text>
      <Text style={styles.sub}>Estimated wait: {seconds}s</Text>
      {opponent ? <Text style={styles.vs}>VS {opponent.username} · {countdown}</Text> : null}
      <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryLabel}>Cancel</Text>
      </Pressable>
    </SafeAreaView>
  );
}
