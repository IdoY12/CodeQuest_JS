import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { setUserIdentity } from "@/redux/profile-slice";
import { REDUX_PERSIST_KEY } from "@/utils/hydrateStore";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";
import type ChangePasswordResponse from "@/models/ChangePasswordResponse";
import type UserProfile from "@/models/UserProfile";

export async function updateUsername(
  token: string,
  name: string,
  dispatch: AppDispatch,
  onDone: () => void,
  setMessage: (m: string | null) => void,
): Promise<void> {
  try {
    const updated = await apiRequest<UserProfile>("/user/profile", {
      method: "PATCH",
      token,
      body: JSON.stringify({ username: name }),
    });
    dispatch(setUserIdentity({ username: updated.username }));
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
    await apiRequest<ChangePasswordResponse>("/user/change-password", {
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
    await AsyncStorage.removeItem(REDUX_PERSIST_KEY);
    resetStoresAfterLogout(dispatch);
    onClose();
  } catch (error) {
    logError("[PROFILE]", error, { phase: "delete-account" });
    Alert.alert("Deletion failed", "We could not delete your account. Please try again.");
  }
}

export async function confirmLogout(
  dispatch: AppDispatch,
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  try {
    await apiRequest<{ ok: boolean }>("/auth/logout", {
      method: "POST",
      ...(accessToken ? { token: accessToken } : {}),
      body: JSON.stringify({ refreshToken: refreshToken ?? "" }),
    });
  } catch {
    // Still clear local session if the network call fails.
  } finally {
    resetStoresAfterLogout(dispatch);
  }
}
