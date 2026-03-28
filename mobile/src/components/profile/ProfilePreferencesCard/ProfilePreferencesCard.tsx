import React from "react";
import { Switch, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { profileFormRowsStyles } from "@/theme/profileFormRows";
import { showLanguageComingSoon, showThemeComingSoon } from "@/utils/profilePreferencesAlerts";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";
import { SettingRow } from "../SettingRow/SettingRow";

export type ProfilePreferencesCardProps = Pick<
  UseProfileScreenReturn,
  "soundsEnabled" | "hapticsEnabled" | "onToggleSounds" | "onToggleHaptics"
>;

export function ProfilePreferencesCard({
  soundsEnabled,
  hapticsEnabled,
  onToggleSounds,
  onToggleHaptics,
}: ProfilePreferencesCardProps) {
  return (
    <View style={profileSectionCardStyles.card}>
      <Text style={profileSectionCardStyles.sectionHeader}>Preferences</Text>
      <SettingRow icon="🌐" label="Language" subtitle="English" onPress={showLanguageComingSoon} />
      <SettingRow icon="🌓" label="Theme" subtitle="System default" onPress={showThemeComingSoon} />
      <View style={profileFormRowsStyles.rowWithSwitch}>
        <View style={profileFormRowsStyles.rowLeft}>
          <Text style={profileFormRowsStyles.rowIcon}>🔊</Text>
          <Text style={profileFormRowsStyles.rowText}>Sounds</Text>
        </View>
        <Switch value={soundsEnabled} onValueChange={onToggleSounds} />
      </View>
      <View style={profileFormRowsStyles.rowWithSwitch}>
        <View style={profileFormRowsStyles.rowLeft}>
          <Text style={profileFormRowsStyles.rowIcon}>📳</Text>
          <Text style={profileFormRowsStyles.rowText}>Haptic Feedback</Text>
        </View>
        <Switch value={hapticsEnabled} onValueChange={onToggleHaptics} />
      </View>
    </View>
  );
}
