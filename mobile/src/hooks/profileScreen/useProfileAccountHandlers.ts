import React from "react";
import { Alert } from "react-native";
import { useAppDispatch } from "../../store/hooks";
import { sessionActions } from "../../store/slices/sessionSlice";
import { changePasswordRequest, updateUsername } from "./accountMutations";
import type { useProfileDraftState } from "./useProfileDraftState";
import type { useProfileRedux } from "./useProfileRedux";

type R = ReturnType<typeof useProfileRedux>;
type D = ReturnType<typeof useProfileDraftState>;

export function useProfileAccountHandlers(r: R, d: D) {
  const dispatch = useAppDispatch();
  const onSaveUsername = React.useCallback(async () => {
    if (!r.accessToken || !d.draftUsername.trim() || d.busyAction) return;
    d.setBusyAction("username");
    await updateUsername(
      r.accessToken,
      d.draftUsername.trim(),
      dispatch,
      () => d.setUsernameModalVisible(false),
      d.setSaveMessage,
    );
    d.setBusyAction(null);
  }, [r.accessToken, d.draftUsername, d.busyAction, dispatch, d.setBusyAction, d.setUsernameModalVisible, d.setSaveMessage]);

  const onChangePassword = React.useCallback(async () => {
    if (!r.accessToken || d.busyAction) return;
    if (d.newPassword.length < 6) {
      Alert.alert("Invalid password", "New password should be at least 6 characters.");
      return;
    }
    d.setBusyAction("password");
    await changePasswordRequest(r.accessToken, d.currentPassword, d.newPassword, () => {
      d.setCurrentPassword("");
      d.setNewPassword("");
      d.setPasswordModalVisible(false);
    }, d.setSaveMessage);
    d.setBusyAction(null);
  }, [
    r.accessToken,
    d.busyAction,
    d.newPassword,
    d.currentPassword,
    d.setBusyAction,
    d.setCurrentPassword,
    d.setNewPassword,
    d.setPasswordModalVisible,
    d.setSaveMessage,
  ]);

  const onToggleSounds = React.useCallback(
    (value: boolean) => {
      void dispatch(sessionActions.toggleSounds(value));
    },
    [dispatch],
  );

  const onToggleHaptics = React.useCallback(
    (value: boolean) => {
      void dispatch(sessionActions.toggleHaptics(value));
    },
    [dispatch],
  );

  return { onSaveUsername, onChangePassword, onToggleSounds, onToggleHaptics };
}
