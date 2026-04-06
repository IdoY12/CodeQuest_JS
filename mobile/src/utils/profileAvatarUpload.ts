import { Alert } from "react-native";
import type { AppDispatch } from "@/redux/store";
import type UserService from "@/services/UserService";
import { logError } from "@/utils/logger";
import { setUserIdentity } from "@/redux/profile-slice";
import {
  alertIfBlobTooLarge,
  blobFromUri,
  ensurePickerPermission,
  pickImageUri,
  resizeToJpeg,
} from "@/utils/profileAvatarPick";

export async function persistAvatarUrl(user: UserService, publicUrl: string, dispatch: AppDispatch): Promise<void> {
  const saved = await user.patchAvatar(publicUrl);
  dispatch(setUserIdentity({ avatarUrl: saved.avatarUrl }));
}

export async function runAvatarUpload(
  user: UserService,
  source: "camera" | "library",
  dispatch: AppDispatch,
  setProgress: (n: number) => void,
  setSaveMessage: (m: string | null) => void,
): Promise<void> {
  setProgress(8);
  const allowed = await ensurePickerPermission(source);
  if (!allowed) return;
  setProgress(12);
  const rawUri = await pickImageUri(source);
  if (!rawUri) return;
  setProgress(20);
  const jpegUri = await resizeToJpeg(rawUri);
  setProgress(38);
  const blob = await blobFromUri(user, jpegUri);
  if (alertIfBlobTooLarge(blob)) return;
  const signed = await user.presignAvatarUpload("image/jpeg", blob.size);
  setProgress(62);
  await user.putPresignedAvatarBlob(signed.uploadUrl, blob);
  setProgress(85);
  await persistAvatarUrl(user, signed.publicUrl, dispatch);
  setProgress(100);
  setSaveMessage("Profile picture updated.");
}

export function handleAvatarUploadError(error: unknown): void {
  logError("[PROFILE]", error, { phase: "avatar-upload" });
  Alert.alert("Upload failed", "Could not update profile picture. Please try again.");
}
