import React from "react";
import { Pressable, Text, TextInput } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { colors } from "@/theme/theme";
import { ProfileModalShell } from "../ProfileModal/ProfileModalShell";
import { profileModalStyles } from "../ProfileModal/ProfileModal.styles";

export type ProfileUsernameModalProps = Pick<
  UseProfileScreenReturn,
  | "usernameModalVisible"
  | "setUsernameModalVisible"
  | "draftUsername"
  | "setDraftUsername"
  | "busyAction"
  | "onSaveUsername"
>;

export function ProfileUsernameModal({
  usernameModalVisible,
  setUsernameModalVisible,
  draftUsername,
  setDraftUsername,
  busyAction,
  onSaveUsername,
}: ProfileUsernameModalProps) {
  return (
    <ProfileModalShell
      visible={usernameModalVisible}
      onRequestClose={() => setUsernameModalVisible(false)}
      title="Edit Username"
      body={
        <TextInput
          style={profileModalStyles.modalInput}
          value={draftUsername}
          onChangeText={setDraftUsername}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor={colors.textMuted}
        />
      }
      actions={
        <>
          <Pressable style={profileModalStyles.modalGhost} onPress={() => setUsernameModalVisible(false)}>
            <Text style={profileModalStyles.modalGhostText}>Cancel</Text>
          </Pressable>
          <Pressable style={profileModalStyles.modalPrimary} onPress={() => void onSaveUsername()}>
            <Text style={profileModalStyles.modalPrimaryText}>{busyAction === "username" ? "Saving..." : "Save"}</Text>
          </Pressable>
        </>
      }
    />
  );
}
