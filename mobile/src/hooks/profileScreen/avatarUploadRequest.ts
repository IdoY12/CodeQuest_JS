import { Alert } from "react-native";
import type { AppDispatch } from "@/redux/store";
import { apiRequest } from "../../services/api";
import { logError } from "../../services/logger";
import { setUserIdentity } from "@/redux/profile-slice";
import type AvatarPatchResponse from "@/models/AvatarPatchResponse";
import type AvatarPresignedUrl from "@/models/AvatarPresignedUrl";
import {
  alertIfBlobTooLarge,
  blobFromUri,
  ensurePickerPermission,
  pickImageUri,
  resizeToJpeg,
} from "./avatarPickerHelpers";

export async function putBlobToSignedUrl(uploadUrl: string, blob: Blob): Promise<boolean> {
  const uploadResult = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: blob,
  });
  return uploadResult.ok;
}

export async function persistAvatarUrl(token: string, publicUrl: string, dispatch: AppDispatch): Promise<void> {
  const saved = await apiRequest<AvatarPatchResponse>("/user/avatar", {
    method: "PATCH",
    token,
    body: JSON.stringify({ avatarUrl: publicUrl }),
  });
  dispatch(setUserIdentity({ avatarUrl: saved.avatarUrl }));
}

export async function requestPresignedAvatarUrl(token: string, size: number) {
  return apiRequest<AvatarPresignedUrl>(
    `/user/avatar/presigned-url?contentType=${encodeURIComponent("image/jpeg")}&fileSize=${size}`,
    { token },
  );
}

export async function runAvatarUpload(
  token: string,
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
  const blob = await blobFromUri(jpegUri);
  if (alertIfBlobTooLarge(blob)) return;
  const signed = await requestPresignedAvatarUrl(token, blob.size);
  setProgress(62);
  const ok = await putBlobToSignedUrl(signed.uploadUrl, blob);
  if (!ok) throw new Error("Upload failed");
  setProgress(85);
  await persistAvatarUrl(token, signed.publicUrl, dispatch);
  setProgress(100);
  setSaveMessage("Profile picture updated.");
}

export function handleAvatarUploadError(error: unknown): void {
  logError("[PROFILE]", error, { phase: "avatar-upload" });
  Alert.alert("Upload failed", "Could not update profile picture. Please try again.");
}
