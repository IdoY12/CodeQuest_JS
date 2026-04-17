import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/redux/hooks";
import { useDuelSocket } from "@/hooks/useDuelSocket";
import { logDuel, logNav } from "@/utils/logger";
import type { MatchmakingScreenProps } from "@/types/duelNavigation.types";
import { styles } from "./DuelNavigator.styles";

const QUEUE_TIMER_INTERVAL_MS = 1000;
const MATCH_COUNTDOWN_TICK_MS = 700;
const FALLBACK_PLAYERS_ONLINE = 143;

export function DuelMatchmakingScreen({ navigation }: MatchmakingScreenProps) {
  const { playersOnline, sessionId, opponent, joinQueue, leaveQueue } = useDuelSocket();
  const userId = useAppSelector((s) => s.session.userId);
  const username = useAppSelector((s) => s.profile.username);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const [seconds, setSeconds] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const hasJoinedQueueRef = useRef(false);
  const usernameRef = useRef(username);
  const accessTokenRef = useRef(accessToken);

  useEffect(() => {
    usernameRef.current = username;
    accessTokenRef.current = accessToken;
  }, [username, accessToken]);

  useEffect(() => {
    logNav("screen:enter", { screen: "MatchmakingScreen" });
    return () => logNav("screen:leave", { screen: "MatchmakingScreen" });
  }, []);

  useEffect(() => {
    if (!userId || !accessToken || hasJoinedQueueRef.current) return;
    hasJoinedQueueRef.current = true;
    joinQueue({ userId, username: usernameRef.current, token: accessTokenRef.current });
    logDuel("queue:join", { userId });

    const interval = setInterval(() => setSeconds((v) => v + 1), QUEUE_TIMER_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      logDuel("queue:leave", { userId: userId ?? "unknown" });
      leaveQueue();
      hasJoinedQueueRef.current = false;
    };
  }, [accessToken, joinQueue, leaveQueue, userId]);

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
      {opponent ? (
        <View style={styles.matchOppRow}>
          {opponent.avatarUrl ? (
            <Image source={{ uri: opponent.avatarUrl }} style={styles.matchOppAvatar} />
          ) : (
            <View style={styles.matchOppInitial}>
              <Text style={styles.matchOppInitialTxt}>{(opponent.username || "?").slice(0, 1).toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.vsInline}>
            VS {opponent.username} · {countdown}
          </Text>
        </View>
      ) : null}
      <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryLabel}>Cancel</Text>
      </Pressable>
    </SafeAreaView>
  );
}
