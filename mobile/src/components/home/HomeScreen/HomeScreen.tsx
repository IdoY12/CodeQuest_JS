import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHomeScreen } from "@/hooks/useHomeScreen";
import { useAppSelector } from "@/redux/hooks";
import type { HomeMainScreenProps } from "@/types/homeNavigation.types";
import { guardDuelAccess } from "@/utils/formatHelpers";
import { styles } from "./HomeScreen.styles";

export function HomeScreen({ navigation }: HomeMainScreenProps) {
  const h = useHomeScreen();
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const onDuelPress = () =>
    guardDuelAccess(
      isGuest,
      () => navigation.getParent()?.getParent()?.navigate("Auth" as never),
      () => navigation.navigate("DuelTab"),
    );
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Good morning, {h.username} 👋</Text>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Practice time today</Text>
          <Text style={styles.subText}>
            {h.practiceMinutesToday} / {h.dailyGoalMinutes} min
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${h.dailyGoalProgressPct}%` }]} />
          </View>
        </View>
        {h.multiplierEndsAt && h.remainingMultiplierMs > 0 ? (
          <View style={styles.multiplierCard}>
            <Text style={styles.cardTitle}>⚡ {h.multiplierFactor.toFixed(0)}x XP Window</Text>
            <Text style={styles.timer}>
              Ends in {String(h.multiplierMinutes).padStart(2, "0")}:{String(h.multiplierSeconds).padStart(2, "0")}
            </Text>
          </View>
        ) : null}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 {h.streak}-day streak!</Text>
          <Text style={styles.subText}>
            {h.streakShieldAvailable ? "🛡️ Streak Shield ready (one miss protected)" : "Reach 7 days to unlock a Streak Shield"}
          </Text>
          <View style={styles.row}>
            {h.streakDays.map((done, idx) => (
              <View key={idx} style={[styles.dot, done && styles.dotDone, idx === 6 && styles.dotToday]} />
            ))}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Level {h.level} · {h.xp} / {h.nextLevelXp} XP
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${h.currentLevelProgress}%` }]} />
          </View>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.cardTitle}>Continue Learning</Text>
          <Text style={styles.subText}>Jump back into your roadmap and keep your streak alive.</Text>
          <Pressable style={styles.primary} onPress={() => navigation.navigate("LearnTab")}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        </View>
        <View style={styles.dailyCard}>
          <Text style={styles.cardTitle}>👑 Daily Challenge</Text>
          <Text style={styles.subText}>Find the bug in a loop boundary and earn +80 XP bonus.</Text>
          <Text style={styles.timer}>Resets daily</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧩 Daily Code Puzzle</Text>
          <Text style={styles.subText}>Solve one expression puzzle each day for bonus XP.</Text>
          <Pressable style={styles.secondary} onPress={() => navigation.navigate("DailyPuzzle")}>
            <Text style={styles.secondaryText}>Open Puzzle</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚔️ Duel Mode</Text>
          <Text style={styles.subText}>Challenge players worldwide.</Text>
          <Pressable style={styles.secondary} onPress={onDuelPress}>
            <Text style={styles.secondaryText}>Find a Match</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
