import React from "react";
import { Alert } from "react-native";
import { useAppDispatch } from "../../store/hooks";
import { handleAvatarUploadError, runAvatarUpload } from "./avatarUploadRequest";
import type { useProfileDraftState } from "./useProfileDraftState";
import type { useProfileRedux } from "./useProfileRedux";

type R = ReturnType<typeof useProfileRedux>;
type D = ReturnType<typeof useProfileDraftState>;

export function useProfileAvatarHandlers(r: R, d: D) {
  const dispatch = useAppDispatch();
  const pickImageAndUpload = React.useCallback(
    async (source: "camera" | "library") => {
      if (!r.accessToken || d.uploadingAvatar) return;
      try {
        d.setUploadingAvatar(true);
        await runAvatarUpload(r.accessToken, source, dispatch, d.setUploadProgress, d.setSaveMessage);
      } catch (error) {
        handleAvatarUploadError(error);
      } finally {
        setTimeout(() => {
          d.setUploadProgress(0);
          d.setUploadingAvatar(false);
        }, 250);
      }
    },
    [r.accessToken, d.uploadingAvatar, dispatch, d.setUploadingAvatar, d.setUploadProgress],
  );
  const onAvatarPress = React.useCallback(() => {
    Alert.alert("Update profile picture", "Choose where to get your photo from.", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: () => void pickImageAndUpload("camera") },
      { text: "Choose from Library", onPress: () => void pickImageAndUpload("library") },
    ]);
  }, [pickImageAndUpload]);
  return { pickImageAndUpload, onAvatarPress };
}
