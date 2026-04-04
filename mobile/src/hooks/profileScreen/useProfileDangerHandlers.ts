import React from "react";
import { Alert } from "react-native";
import { useAppDispatcher } from "@/redux/hooks";
import { confirmLogout, deleteAccountRequest } from "./accountMutations";
import type { useProfileDraftState } from "./useProfileDraftState";
import type { useProfileRedux } from "./useProfileRedux";

type R = ReturnType<typeof useProfileRedux>;
type D = ReturnType<typeof useProfileDraftState>;

export function useProfileDangerHandlers(r: R, d: D) {
  const dispatch = useAppDispatcher();
  const onDeleteAccount = React.useCallback(async () => {
    if (!r.accessToken || d.confirmDeleteText !== "DELETE" || d.busyAction) return;
    d.setBusyAction("delete");
    await deleteAccountRequest(r.accessToken, dispatch, () => {
      d.setDeleteModalVisible(false);
      d.setConfirmDeleteText("");
    });
    d.setBusyAction(null);
  }, [r.accessToken, d.confirmDeleteText, d.busyAction, dispatch, d.setBusyAction, d.setDeleteModalVisible, d.setConfirmDeleteText]);

  const onLogoutPress = React.useCallback(() => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          void confirmLogout(dispatch, r.accessToken, r.refreshToken);
        },
      },
    ]);
  }, [dispatch, r.accessToken, r.refreshToken]);

  return { onDeleteAccount, onLogoutPress };
}
