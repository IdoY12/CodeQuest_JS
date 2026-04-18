import React from "react";
import { Alert } from "react-native";
import { useAppDispatch } from "@/redux/hooks";
import { toggleHaptics, toggleSounds } from "@/redux/profile-slice";
import type UserService from "@/services/auth-aware/UserService";
import { changePasswordRequest, deleteAccountRequest, updateUsername } from "@/utils/profileAccountMutations";
import { patchUserPreferences } from "@/utils/profileUiAndPreferences";
import { confirmLogout } from "@/utils/confirmLogout";
import type { ProfileDraftState } from "./useProfileDraftState";
import type { ProfileReduxState } from "./useProfileRedux";

export function useProfileAccountHandlers(r: ProfileReduxState, d: ProfileDraftState, user: UserService | null) {
  const dispatch = useAppDispatch();

  const onSavePreferences = React.useCallback(async () => {
    if (!r.accessToken || !user || d.saving) return;
    d.setSaving(true);
    d.setSaveMessage(null);
    await patchUserPreferences(user, d.draftGoal, d.draftLevel, d.draftCommitment, d.draftNotifications, dispatch, d.setSaveMessage);
    d.setSaving(false);
  }, [r.accessToken, d.saving, d.draftGoal, d.draftLevel, d.draftCommitment, d.draftNotifications, dispatch, d.setSaving, d.setSaveMessage, user]);

  const onSaveUsername = React.useCallback(async () => {
    if (!r.accessToken || !user || !d.draftUsername.trim() || d.busyAction) return;
    d.setBusyAction("username");
    await updateUsername(user, d.draftUsername.trim(), dispatch, () => d.setUsernameModalVisible(false), d.setSaveMessage);
    d.setBusyAction(null);
  }, [r.accessToken, d.draftUsername, d.busyAction, dispatch, d.setBusyAction, d.setUsernameModalVisible, d.setSaveMessage, user]);

  const onChangePassword = React.useCallback(async () => {
    if (!r.accessToken || !user || d.busyAction) return;

    if (d.newPassword.length < 6) {
      Alert.alert("Invalid password", "New password should be at least 6 characters.");
      return;
    }
    d.setBusyAction("password");
    await changePasswordRequest(user, d.currentPassword, d.newPassword, () => {
      d.setCurrentPassword("");
      d.setNewPassword("");
      d.setPasswordModalVisible(false);
    }, d.setSaveMessage);
    d.setBusyAction(null);
  }, [r.accessToken, d.busyAction, d.newPassword, d.currentPassword, d.setBusyAction, d.setCurrentPassword, d.setNewPassword, d.setPasswordModalVisible, d.setSaveMessage, user]);

  const onToggleSounds = React.useCallback((v: boolean) => void dispatch(toggleSounds(v)), [dispatch]);

  const onToggleHaptics = React.useCallback((v: boolean) => void dispatch(toggleHaptics(v)), [dispatch]);

  const onDeleteAccount = React.useCallback(async () => {
    if (!r.accessToken || !user || d.confirmDeleteText !== "DELETE" || d.busyAction) return;
    d.setBusyAction("delete");
    await deleteAccountRequest(user, dispatch, () => {
      d.setDeleteModalVisible(false);
      d.setConfirmDeleteText("");
    });
    d.setBusyAction(null);
  }, [r.accessToken, d.confirmDeleteText, d.busyAction, dispatch, d.setBusyAction, d.setDeleteModalVisible, d.setConfirmDeleteText, user]);

  const onLogoutPress = React.useCallback(() => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => void confirmLogout(dispatch, r.accessToken, r.refreshToken) },
    ]);
  }, [dispatch, r.accessToken, r.refreshToken]);

  return {
    onSavePreferences,
    onSaveUsername,
    onChangePassword,
    onToggleSounds,
    onToggleHaptics,
    onDeleteAccount,
    onLogoutPress,
  };
}
