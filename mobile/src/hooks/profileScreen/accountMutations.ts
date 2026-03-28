import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "../../store/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { progressActions } from "../../store/slices/progressSlice";
import { sessionActions } from "../../store/slices/sessionSlice";

export async function updateUsername(
  token: string,
  name: string,
  dispatch: AppDispatch,
  onDone: () => void,
  setMessage: (m: string | null) => void,
): Promise<void> {
  try {
    const updated = await apiRequest<{ id: string; username: string; avatarUrl: string | null }>("/user/profile", {
      method: "PATCH",
      token,
      body: JSON.stringify({ username: name }),
    });
    dispatch(sessionActions.setUserIdentity({ username: updated.username }));
    onDone();
    setMessage("Username updated.");
  } catch (error) {
    logError("[PROFILE]", error, { phase: "update-username" });
    Alert.alert("Update failed", "Could not update username right now.");
  }
}

export async function changePasswordRequest(
  token: string,
  currentPassword: string,
  newPassword: string,
  onSuccess: () => void,
  setMessage: (m: string | null) => void,
): Promise<void> {
  try {
    await apiRequest<{ ok: true }>("/user/change-password", {
      method: "POST",
      token,
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    onSuccess();
    setMessage("Password changed.");
  } catch (error) {
    logError("[PROFILE]", error, { phase: "change-password" });
    Alert.alert("Could not change password", "Check your current password and try again.");
  }
}

export async function deleteAccountRequest(
  token: string,
  dispatch: AppDispatch,
  onClose: () => void,
): Promise<void> {
  try {
    await apiRequest<void>("/user/account", {
      method: "DELETE",
      token,
      body: JSON.stringify({ confirmation: "DELETE" }),
    });
    await AsyncStorage.removeItem("codequest-app-store");
    dispatch(sessionActions.signOut());
    dispatch(progressActions.resetProgress());
    onClose();
  } catch (error) {
    logError("[PROFILE]", error, { phase: "delete-account" });
    Alert.alert("Deletion failed", "We could not delete your account. Please try again.");
  }
}

export function confirmLogout(dispatch: AppDispatch): void {
  dispatch(sessionActions.signOut());
  dispatch(progressActions.resetProgress());
}
