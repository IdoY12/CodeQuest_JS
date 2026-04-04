import { useEffect, useRef } from "react";
import { useAppDispatcher } from "@/redux/hooks";
import type { AppDispatch } from "@/redux/store";
import { logNav } from "@/services/logger";
import type UserService from "@/services/UserService";
import { fetchAndApplyProfile, type DraftSetters } from "@/utils/profileLoadFromApi";
import { useProfileAccountHandlers } from "./useProfileAccountHandlers";
import { useProfileAvatarHandlers } from "./useProfileAvatarHandlers";
import { useProfileDraftState } from "./useProfileDraftState";
import { useProfileRedux } from "./useProfileRedux";
import { useService } from "@/hooks/useService";
import UserServiceClass from "@/services/UserService";

function useProfileLifecycle(
  user: UserService,
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
    if (!accessToken) {
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
  const dispatch = useAppDispatcher();
  const user = useService(UserServiceClass);
  const r = useProfileRedux();
  const d = useProfileDraftState(r);
  useProfileLifecycle(user, r.accessToken, dispatch, r.username, d.setDraftUsername, d.setScreenLoading, {
    setDraftGoal: d.setDraftGoal,
    setDraftLevel: d.setDraftLevel,
    setDraftCommitment: d.setDraftCommitment,
    setDraftNotifications: d.setDraftNotifications,
  });
  const { onSavePreferences, ...handlers } = useProfileAccountHandlers(r, d, user);
  const { onAvatarPress } = useProfileAvatarHandlers(r, d, user);
  return { ...r, ...d, onSavePreferences, onAvatarPress, ...handlers };
}

export type UseProfileScreenReturn = ReturnType<typeof useProfileScreen>;
