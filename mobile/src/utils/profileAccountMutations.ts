import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "@/redux/store";
import type UserService from "@/services/auth-aware/UserService";
import { logError } from "@/utils/logger";
import { setUserIdentity } from "@/redux/profile-slice";
import { REDUX_PERSIST_KEY } from "@/utils/hydrateStore";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";

export async function updateUsername(
  user: UserService,
  name: string,
  dispatch: AppDispatch,
  onDone: () => void,
  setMessage: (m: string | null) => void,
): Promise<void> {
  try {
    const updated = await user.patchUsername(name.trim());
    dispatch(setUserIdentity({ username: updated.username }));
    onDone();
    setMessage("Username updated.");
  } catch (error) {
    logError("[PROFILE]", error, { phase: "update-username" });
    Alert.alert("Update failed", "Could not update username right now.");
  }
}

export async function changePasswordRequest(
  user: UserService,
  currentPassword: string,
  newPassword: string,
  onSuccess: () => void,
  setMessage: (m: string | null) => void,
): Promise<void> {
  try {
    await user.changePassword(currentPassword, newPassword);
    onSuccess();
    setMessage("Password changed.");
  } catch (error) {
    logError("[PROFILE]", error, { phase: "change-password" });
    Alert.alert("Could not change password", "Check your current password and try again.");
  }
}

export async function deleteAccountRequest(
  user: UserService,
  dispatch: AppDispatch,
  onClose: () => void,
): Promise<void> {
  try {
    await user.deleteAccount();
    await AsyncStorage.removeItem(REDUX_PERSIST_KEY);
    resetStoresAfterLogout(dispatch);
    onClose();
  } catch (error) {
    logError("[PROFILE]", error, { phase: "delete-account" });
    Alert.alert("Deletion failed", "We could not delete your account. Please try again.");
  }
}
