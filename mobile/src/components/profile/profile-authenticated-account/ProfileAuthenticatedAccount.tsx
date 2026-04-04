import { Pressable, Switch, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { profileFormRowsStyles } from "@/theme/profileFormRows";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";
import { a } from "./ProfileAuthenticatedAccount.styles";

export function ProfileAuthenticatedAccount({ p }: { p: UseProfileScreenReturn }) {
  return (
    <View style={profileSectionCardStyles.card}>
      <Text style={profileSectionCardStyles.sectionHeader}>Account</Text>
      <Pressable style={({ pressed }) => [a.row, pressed && a.rowPress]} onPress={() => p.setUsernameModalVisible(true)}>
        <View style={profileFormRowsStyles.rowLeft}>
          <Text style={profileFormRowsStyles.rowIcon}>👤</Text>
          <Text style={profileFormRowsStyles.rowText}>Edit Username</Text>
        </View>
        <Text style={a.chev}>›</Text>
      </Pressable>
      <Pressable style={({ pressed }) => [a.row, pressed && a.rowPress]} onPress={() => p.setPasswordModalVisible(true)}>
        <View style={profileFormRowsStyles.rowLeft}>
          <Text style={profileFormRowsStyles.rowIcon}>🔒</Text>
          <Text style={profileFormRowsStyles.rowText}>Change Password</Text>
        </View>
        <Text style={a.chev}>›</Text>
      </Pressable>
      <View style={profileFormRowsStyles.rowWithSwitch}>
        <View style={profileFormRowsStyles.rowLeft}>
          <Text style={profileFormRowsStyles.rowIcon}>🔔</Text>
          <Text style={profileFormRowsStyles.rowText}>Notifications</Text>
        </View>
        <Switch value={p.draftNotifications} onValueChange={p.setDraftNotifications} />
      </View>
    </View>
  );
}
