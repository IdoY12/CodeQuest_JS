import React from "react";
import { Alert } from "react-native";
import { useAppDispatcher } from "@/redux/hooks";
import type UserService from "@/services/UserService";
import { handleAvatarUploadError, runAvatarUpload } from "@/utils/profileAvatarUpload";
import type { ProfileDraftState } from "./useProfileDraftState";
import type { ProfileReduxState } from "./useProfileRedux";

export function useProfileAvatarHandlers(r: ProfileReduxState, d: ProfileDraftState, user: UserService) {
  const dispatch = useAppDispatcher();
  const pickImageAndUpload = React.useCallback(
    async (source: "camera" | "library") => {
      if (!r.accessToken || d.uploadingAvatar) return;
      try {
        d.setUploadingAvatar(true);
        await runAvatarUpload(user, source, dispatch, d.setUploadProgress, d.setSaveMessage);
      } catch (error) {
        handleAvatarUploadError(error);
      } finally {
        setTimeout(() => {
          d.setUploadProgress(0);
          d.setUploadingAvatar(false);
        }, 250);
      }
    },
    [r.accessToken, d.uploadingAvatar, dispatch, d.setUploadingAvatar, d.setUploadProgress, user],
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
