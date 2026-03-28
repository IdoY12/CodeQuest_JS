import React from "react";
import { Pressable, Text, TextInput } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { colors } from "@/theme/theme";
import { ProfileModalShell } from "../ProfileModal/ProfileModalShell";
import { profileModalStyles } from "../ProfileModal/ProfileModal.styles";

export type ProfilePasswordModalProps = Pick<
  UseProfileScreenReturn,
  | "passwordModalVisible"
  | "setPasswordModalVisible"
  | "currentPassword"
  | "setCurrentPassword"
  | "newPassword"
  | "setNewPassword"
  | "busyAction"
  | "onChangePassword"
>;

export function ProfilePasswordModal({
  passwordModalVisible,
  setPasswordModalVisible,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  busyAction,
  onChangePassword,
}: ProfilePasswordModalProps) {
  return (
    <ProfileModalShell
      visible={passwordModalVisible}
      onRequestClose={() => setPasswordModalVisible(false)}
      title="Change Password"
      body={
        <>
          <TextInput
            style={profileModalStyles.modalInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Current password"
            placeholderTextColor={colors.textMuted}
          />
          <TextInput
            style={profileModalStyles.modalInput}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="New password"
            placeholderTextColor={colors.textMuted}
          />
        </>
      }
      actions={
        <>
          <Pressable style={profileModalStyles.modalGhost} onPress={() => setPasswordModalVisible(false)}>
            <Text style={profileModalStyles.modalGhostText}>Cancel</Text>
          </Pressable>
          <Pressable style={profileModalStyles.modalPrimary} onPress={() => void onChangePassword()}>
            <Text style={profileModalStyles.modalPrimaryText}>{busyAction === "password" ? "Updating..." : "Update"}</Text>
          </Pressable>
        </>
      }
    />
  );
}
