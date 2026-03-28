import React from "react";
import { Pressable, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { SettingRow } from "../SettingRow/SettingRow";
import { profileDangerStyles } from "./ProfileDangerZone.styles";

export type ProfileDangerZoneProps = Pick<UseProfileScreenReturn, "setDeleteModalVisible" | "onLogoutPress">;

export function ProfileDangerZone({ setDeleteModalVisible, onLogoutPress }: ProfileDangerZoneProps) {
  return (
    <View style={profileDangerStyles.dangerCard}>
      <Text style={profileDangerStyles.dangerHeader}>Danger Zone</Text>
      <SettingRow
        icon="🗑️"
        label="Delete Account"
        labelStyle={profileDangerStyles.dangerLabel}
        onPress={() => setDeleteModalVisible(true)}
      />
      <Pressable onPress={onLogoutPress} style={profileDangerStyles.logoutButton} accessibilityLabel="Log out">
        <Text style={profileDangerStyles.logoutLabel}>Log Out</Text>
      </Pressable>
    </View>
  );
}
