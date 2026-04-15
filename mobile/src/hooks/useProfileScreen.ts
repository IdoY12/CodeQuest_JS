import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import type { AppDispatch } from "@/redux/store";
import { logNav } from "@/utils/logger";
import type UserService from "@/services/UserService";
import { fetchAndApplyProfile, type DraftSetters } from "@/utils/profileLoadFromApi";
import { useProfileAccountHandlers } from "./useProfileAccountHandlers";
import { useProfileAvatarHandlers } from "./useProfileAvatarHandlers";
import { useProfileDraftState } from "./useProfileDraftState";
import { useProfileRedux } from "./useProfileRedux";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import UserServiceClass from "@/services/UserService";

function useProfileLifecycle(
  user: UserService | null,
  accessToken: string | null,
  dispatch: AppDispatch,
  username: string,
  setDraftUsername: (u: string) => void,
  setScreenLoading: (v: boolean) => void,
  drafts: DraftSetters,
) {
  useEffect(() => {
    logNav("screen:enter", { screen: "ProfileScreen" });
    return () => logNav("screen:leave", { screen: "ProfileScreen" });
  }, []);

  useEffect(() => setDraftUsername(username), [username, setDraftUsername]);

  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  useEffect(() => {
    if (!accessToken || !user) {
      setScreenLoading(false);
      return;
    }
    let active = true;
    const run = async () => {
      setScreenLoading(true);
      await fetchAndApplyProfile(user, dispatch, draftsRef.current, () => active);
      if (active) setScreenLoading(false);
    };
    void run();
    return () => {
      active = false;
    };
  }, [accessToken, dispatch, setScreenLoading, user]);
}

export function useProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAuthenticatedService(UserServiceClass);
  const profileRedux = useProfileRedux();
  const profileDraft = useProfileDraftState(profileRedux);

  useProfileLifecycle(user, profileRedux.accessToken, dispatch, profileRedux.username, profileDraft.setDraftUsername, profileDraft.setScreenLoading, {
    setDraftGoal: profileDraft.setDraftGoal,
    setDraftLevel: profileDraft.setDraftLevel,
    setDraftCommitment: profileDraft.setDraftCommitment,
    setDraftNotifications: profileDraft.setDraftNotifications,
  });

  const { onSavePreferences, ...handlers } = useProfileAccountHandlers(profileRedux, profileDraft, user);
  const { onAvatarPress } = useProfileAvatarHandlers(profileRedux, profileDraft, user);

  return { ...profileRedux, ...profileDraft, onSavePreferences, onAvatarPress, ...handlers };
}

export type UseProfileScreenReturn = ReturnType<typeof useProfileScreen>;
