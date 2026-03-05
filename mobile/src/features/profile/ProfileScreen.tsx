import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../stores/useAppStore";
import { colors, fontSize, radius, spacing } from "../../theme/theme";
import { apiRequest } from "../../services/api";

const goals = [
  { key: "JOB", label: "Land a dev job" },
  { key: "WORK", label: "Level up at work" },
  { key: "FUN", label: "Code for fun" },
  { key: "PROJECT", label: "Build a project" },
] as const;

const levels = [
  { key: "BEGINNER", label: "Complete Beginner" },
  { key: "BASICS", label: "I Know the Basics" },
  { key: "INTERMEDIATE", label: "Intermediate" },
  { key: "ADVANCED", label: "Advanced" },
] as const;

const commitmentOptions = [
  { key: "10", label: "10 min" },
  { key: "15", label: "15 min" },
  { key: "30", label: "30 min" },
] as const;

export function ProfileScreen() {
  const username = useAppStore((s) => s.username);
  const level = useAppStore((s) => s.level);
  const xp = useAppStore((s) => s.xpTotal);
  const goal = useAppStore((s) => s.goal);
  const experience = useAppStore((s) => s.experience);
  const commitment = useAppStore((s) => s.commitment);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const accessToken = useAppStore((s) => s.accessToken);
  const soundsEnabled = useAppStore((s) => s.soundsEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const toggleSounds = useAppStore((s) => s.toggleSounds);
  const toggleHaptics = useAppStore((s) => s.toggleHaptics);
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);
  const signOut = useAppStore((s) => s.signOut);
  const [draftGoal, setDraftGoal] = React.useState<typeof goals[number]["key"]>(goal ?? "FUN");
  const [draftLevel, setDraftLevel] = React.useState<typeof levels[number]["key"]>(experience ?? "BEGINNER");
  const [draftCommitment, setDraftCommitment] = React.useState<typeof commitmentOptions[number]["key"]>(commitment ?? "15");
  const [draftNotifications, setDraftNotifications] = React.useState<boolean>(notificationsEnabled);
  const [saving, setSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);

  const onSavePreferences = async () => {
    if (!accessToken || saving) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      const response = await apiRequest<{
        goal: typeof goals[number]["key"];
        experienceLevel: typeof levels[number]["key"];
        dailyCommitmentMinutes: 10 | 15 | 30;
        notificationsEnabled: boolean;
        pathKey: "BEGINNER" | "ADVANCED";
      }>("/user/preferences", {
        method: "PATCH",
        token: accessToken,
        body: JSON.stringify({
          goal: draftGoal,
          experienceLevel: draftLevel,
          dailyCommitmentMinutes: Number(draftCommitment),
          notificationsEnabled: draftNotifications,
        }),
      });

      updatePreferences({
        goal: response.goal,
        experience: response.experienceLevel,
        commitment: String(response.dailyCommitmentMinutes) as "10" | "15" | "30",
        notificationsEnabled: response.notificationsEnabled,
        path: response.pathKey,
      });
      setNotificationsEnabled(response.notificationsEnabled);
      setSaveMessage("Preferences updated!");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Could not save preferences.");
    } finally {
      setSaving(false);
    }
  };

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
          <ToggleRow
            label="Practice Notifications"
            value={draftNotifications}
            onToggle={() => setDraftNotifications((value) => !value)}
            accessibilityLabel="Toggle practice notifications"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My Learning Preferences</Text>
          <Text style={styles.fieldLabel}>My Goal</Text>
          <OptionRow
            values={goals.map((item) => ({ key: item.key, label: item.label }))}
            selected={draftGoal}
            onSelect={(value) => setDraftGoal(value as typeof goals[number]["key"])}
          />
          <Text style={styles.fieldLabel}>My JavaScript Level</Text>
          <OptionRow
            values={levels.map((item) => ({ key: item.key, label: item.label }))}
            selected={draftLevel}
            onSelect={(value) => setDraftLevel(value as typeof levels[number]["key"])}
          />
          <Text style={styles.fieldLabel}>Daily Practice Goal</Text>
          <OptionRow
            values={commitmentOptions.map((item) => ({ key: item.key, label: item.label }))}
            selected={draftCommitment}
            onSelect={(value) => setDraftCommitment(value as typeof commitmentOptions[number]["key"])}
          />

          <Pressable style={[styles.saveButton, saving && styles.saveButtonDisabled]} disabled={saving} onPress={onSavePreferences}>
            <Text style={styles.saveButtonLabel}>{saving ? "Saving..." : "Save Preferences"}</Text>
          </Pressable>
          {saveMessage ? <Text style={styles.saveMessage}>{saveMessage}</Text> : null}

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

function OptionRow({
  values,
  selected,
  onSelect,
}: {
  values: Array<{ key: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.optionRow}>
      {values.map((value) => (
        <Pressable
          key={value.key}
          onPress={() => onSelect(value.key)}
          style={[styles.choiceChip, selected === value.key && styles.choiceChipSelected]}
        >
          <Text style={[styles.choiceChipLabel, selected === value.key && styles.choiceChipLabelSelected]}>{value.label}</Text>
        </Pressable>
      ))}
    </View>
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
  fieldLabel: { color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm, fontWeight: "700" },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  choiceChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  choiceChipSelected: { borderColor: colors.accent, backgroundColor: "rgba(247,223,30,0.15)" },
  choiceChipLabel: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "600" },
  choiceChipLabelSelected: { color: colors.accent },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  toggleLabel: { color: colors.textPrimary },
  toggle: { borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  toggleOn: { backgroundColor: colors.success },
  toggleOff: { backgroundColor: colors.textMuted },
  toggleText: { color: colors.background, fontWeight: "800" },
  saveButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonLabel: { color: "#111", fontWeight: "800" },
  saveMessage: { marginTop: spacing.sm, color: colors.success, fontWeight: "700" },
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
