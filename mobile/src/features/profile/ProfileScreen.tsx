import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../stores/useAppStore";
import { colors, fontSize, radius, spacing } from "../../theme/theme";

export function ProfileScreen() {
  const username = useAppStore((s) => s.username);
  const level = useAppStore((s) => s.level);
  const xp = useAppStore((s) => s.xpTotal);
  const soundsEnabled = useAppStore((s) => s.soundsEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const toggleSounds = useAppStore((s) => s.toggleSounds);
  const toggleHaptics = useAppStore((s) => s.toggleHaptics);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.avatar}>{"{ }"}</Text>
          <Text style={styles.name}>{username}</Text>
          <Text style={styles.title}>JS Apprentice</Text>
          <Text style={styles.meta}>
            Level {level} · {xp} XP
          </Text>
        </View>

      <View style={styles.grid}>
        <StatCard label="🔥 Current Streak" value="7 days" />
        <StatCard label="⚡ Total XP" value={String(xp)} />
        <StatCard label="⚔️ Duel Win Rate" value="66%" />
        <StatCard label="📚 Lessons Completed" value="12" />
      </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <ToggleRow
            label="Sounds"
            value={soundsEnabled}
            onToggle={toggleSounds}
            accessibilityLabel="Toggle sounds setting"
          />
          <ToggleRow
            label="Haptic Feedback"
            value={hapticsEnabled}
            onToggle={toggleHaptics}
            accessibilityLabel="Toggle haptic setting"
          />
          <Pressable
            onPress={() =>
              Alert.alert("Log out", "Are you sure you want to log out?", [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: signOut },
              ])
            }
            style={styles.logoutButton}
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutLabel}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
  accessibilityLabel,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Pressable
        onPress={onToggle}
        style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={styles.toggleText}>{value ? "ON" : "OFF"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, gap: spacing.lg },
  header: { alignItems: "center", backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.xl, borderWidth: 1, borderColor: colors.border },
  avatar: { fontSize: fontSize.xxl, color: colors.accent, fontWeight: "800" },
  name: { marginTop: spacing.sm, color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "800" },
  title: { color: colors.textSecondary, marginTop: spacing.xs },
  meta: { color: colors.success, marginTop: spacing.sm, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  statCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  statLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  statValue: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "700", marginTop: spacing.sm },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "700", marginBottom: spacing.md },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  toggleLabel: { color: colors.textPrimary },
  toggle: { borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  toggleOn: { backgroundColor: colors.success },
  toggleOff: { backgroundColor: colors.textMuted },
  toggleText: { color: colors.background, fontWeight: "800" },
  logoutButton: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  logoutLabel: { color: colors.danger, fontWeight: "800" },
});
