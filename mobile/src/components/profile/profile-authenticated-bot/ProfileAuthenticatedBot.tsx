import { Pressable, Switch, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { profileFormRowsStyles } from "@/theme/profileFormRows";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";
import { openSupportUrl, showLanguageComingSoon, showThemeComingSoon } from "@/utils/profileUiAndPreferences";
import { b } from "./ProfileAuthenticatedBot.styles";

export function ProfileAuthenticatedBot({ p }: { p: UseProfileScreenReturn }) {
  return (
    <>
      <View style={profileSectionCardStyles.card}>
        <Text style={profileSectionCardStyles.sectionHeader}>Preferences</Text>
        <Pressable style={({ pressed }) => [b.row, pressed && b.rowPress]} onPress={showLanguageComingSoon}>
          <View style={profileFormRowsStyles.rowLeft}>
            <Text style={profileFormRowsStyles.rowIcon}>🌐</Text>
            <View>
              <Text style={profileFormRowsStyles.rowText}>Language</Text>
              <Text style={profileFormRowsStyles.rowSubText}>English</Text>
            </View>
          </View>
          <Text style={b.chev}>›</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [b.row, pressed && b.rowPress]} onPress={showThemeComingSoon}>
          <View style={profileFormRowsStyles.rowLeft}>
            <Text style={profileFormRowsStyles.rowIcon}>🌓</Text>
            <View>
              <Text style={profileFormRowsStyles.rowText}>Theme</Text>
              <Text style={profileFormRowsStyles.rowSubText}>System default</Text>
            </View>
          </View>
          <Text style={b.chev}>›</Text>
        </Pressable>
        <View style={profileFormRowsStyles.rowWithSwitch}>
          <View style={profileFormRowsStyles.rowLeft}>
            <Text style={profileFormRowsStyles.rowIcon}>🔊</Text>
            <Text style={profileFormRowsStyles.rowText}>Sounds</Text>
          </View>
          <Switch value={p.soundsEnabled} onValueChange={p.onToggleSounds} />
        </View>
        <View style={profileFormRowsStyles.rowWithSwitch}>
          <View style={profileFormRowsStyles.rowLeft}>
            <Text style={profileFormRowsStyles.rowIcon}>📳</Text>
            <Text style={profileFormRowsStyles.rowText}>Haptic Feedback</Text>
          </View>
          <Switch value={p.hapticsEnabled} onValueChange={p.onToggleHaptics} />
        </View>
      </View>
      <View style={profileSectionCardStyles.card}>
        <Text style={profileSectionCardStyles.sectionHeader}>Support</Text>
        {p.supportRows.map((row) => (
          <Pressable key={row.label} style={({ pressed }) => [b.row, pressed && b.rowPress]} onPress={() => openSupportUrl(row.url)}>
            <View style={profileFormRowsStyles.rowLeft}>
              <Text style={profileFormRowsStyles.rowIcon}>{row.icon}</Text>
              <Text style={profileFormRowsStyles.rowText}>{row.label}</Text>
            </View>
            <Text style={b.chev}>›</Text>
          </Pressable>
        ))}
      </View>
      <View style={b.dangerCard}>
        <Text style={b.dangerHeader}>Danger Zone</Text>
        <Pressable style={({ pressed }) => [b.row, pressed && b.rowPress]} onPress={() => p.setDeleteModalVisible(true)}>
          <View style={profileFormRowsStyles.rowLeft}>
            <Text style={profileFormRowsStyles.rowIcon}>🗑️</Text>
            <Text style={[profileFormRowsStyles.rowText, b.dangerLbl]}>Delete Account</Text>
          </View>
          <Text style={b.chev}>›</Text>
        </Pressable>
        <Pressable onPress={p.onLogoutPress} style={b.logoutBtn} accessibilityLabel="Log out">
          <Text style={b.logoutLbl}>Log Out</Text>
        </Pressable>
      </View>
    </>
  );
}
