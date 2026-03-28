import React from "react";
import { Switch, Text, View } from "react-native";
import { profileFormRowsStyles } from "../ProfileFormRows/ProfileFormRows.styles";
import { profileSectionCardStyles } from "../ProfileSectionCard/ProfileSectionCard.styles";
import { SettingRow } from "../SettingRow/SettingRow";

export type ProfileAccountCardProps = {
  setUsernameModalVisible: (visible: boolean) => void;
  setPasswordModalVisible: (visible: boolean) => void;
  draftNotifications: boolean;
  setDraftNotifications: (value: boolean) => void;
};

export function ProfileAccountCard({
  setUsernameModalVisible,
  setPasswordModalVisible,
  draftNotifications,
  setDraftNotifications,
}: ProfileAccountCardProps) {
  return (
    <View style={profileSectionCardStyles.card}>
      <Text style={profileSectionCardStyles.sectionHeader}>Account</Text>
      <SettingRow icon="👤" label="Edit Username" onPress={() => setUsernameModalVisible(true)} />
      <SettingRow icon="🔒" label="Change Password" onPress={() => setPasswordModalVisible(true)} />
      <View style={profileFormRowsStyles.rowWithSwitch}>
        <View style={profileFormRowsStyles.rowLeft}>
          <Text style={profileFormRowsStyles.rowIcon}>🔔</Text>
          <Text style={profileFormRowsStyles.rowText}>Notifications</Text>
        </View>
        <Switch value={draftNotifications} onValueChange={setDraftNotifications} />
      </View>
    </View>
  );
}
