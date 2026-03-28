import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { colors } from "@/theme/theme";
import { ProfileModalShell } from "@/components/profile/ProfileModalShell/ProfileModalShell";
import { profileModalStyles } from "@/components/profile/ProfileModalShell/ProfileModalShell.styles";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";

export type ProfileDeleteModalProps = Pick<
  UseProfileScreenReturn,
  | "deleteModalVisible"
  | "setDeleteModalVisible"
  | "confirmDeleteText"
  | "setConfirmDeleteText"
  | "busyAction"
  | "onDeleteAccount"
>;

export function ProfileDeleteModal({
  deleteModalVisible,
  setDeleteModalVisible,
  confirmDeleteText,
  setConfirmDeleteText,
  busyAction,
  onDeleteAccount,
}: ProfileDeleteModalProps) {
  const deleteDisabled = confirmDeleteText !== "DELETE" || busyAction === "delete";
  const dangerStyle = [profileModalStyles.modalDanger, deleteDisabled && profileSectionCardStyles.saveButtonDisabled];
  return (
    <ProfileModalShell
      visible={deleteModalVisible}
      onRequestClose={() => setDeleteModalVisible(false)}
      title="Delete Account"
      body={
        <>
          <Text style={profileModalStyles.modalText}>
            This action is permanent and cannot be undone. Type DELETE to confirm account deletion.
          </Text>
          <TextInput
            style={profileModalStyles.modalInput}
            value={confirmDeleteText}
            onChangeText={setConfirmDeleteText}
            autoCapitalize="characters"
            placeholder="Type DELETE"
            placeholderTextColor={colors.textMuted}
          />
        </>
      }
      actions={
        <>
          <Pressable style={profileModalStyles.modalGhost} onPress={() => setDeleteModalVisible(false)}>
            <Text style={profileModalStyles.modalGhostText}>Cancel</Text>
          </Pressable>
          <Pressable style={dangerStyle} disabled={deleteDisabled} onPress={() => void onDeleteAccount()}>
            <Text style={profileModalStyles.modalDangerText}>{busyAction === "delete" ? "Deleting..." : "Delete"}</Text>
          </Pressable>
        </>
      }
    />
  );
}
