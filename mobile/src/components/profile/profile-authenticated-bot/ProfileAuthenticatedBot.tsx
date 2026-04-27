import { Pressable, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { profileFormRowsStyles } from "@/theme/profileFormRows";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";
import { openSupportUrl } from "@/utils/profileUiAndPreferences";
import { b } from "./ProfileAuthenticatedBot.styles";

export function ProfileAuthenticatedBot({ p }: { p: UseProfileScreenReturn }) {
  return (
    <>
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
