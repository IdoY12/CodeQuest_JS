import { useAppDispatch } from "../store/hooks";
import { useProfileAccountHandlers } from "./profileScreen/useProfileAccountHandlers";
import { useProfileAvatarHandlers } from "./profileScreen/useProfileAvatarHandlers";
import { useProfileDangerHandlers } from "./profileScreen/useProfileDangerHandlers";
import { useProfileDraftState } from "./profileScreen/useProfileDraftState";
import { useProfilePreferenceHandler } from "./profileScreen/useProfilePreferenceHandler";
import { useProfileRedux } from "./profileScreen/useProfileRedux";
import {
  useProfileInitialLoad,
  useProfileNavLogging,
  useProfileUsernameDraftSync,
} from "./profileScreen/useProfileScreenEffects";

export function useProfileScreen() {
  const dispatch = useAppDispatch();
  const r = useProfileRedux();
  const d = useProfileDraftState(r);
  useProfileNavLogging();
  useProfileUsernameDraftSync(r.username, d.setDraftUsername);
  useProfileInitialLoad(r.accessToken, dispatch, d.setScreenLoading, {
    setDraftGoal: d.setDraftGoal,
    setDraftLevel: d.setDraftLevel,
    setDraftCommitment: d.setDraftCommitment,
    setDraftNotifications: d.setDraftNotifications,
  });
  const onSavePreferences = useProfilePreferenceHandler(r, d);
  const { onAvatarPress } = useProfileAvatarHandlers(r, d);
  const account = useProfileAccountHandlers(r, d);
  const danger = useProfileDangerHandlers(r, d);
  return {
    ...r,
    ...d,
    onSavePreferences,
    onAvatarPress,
    ...account,
    ...danger,
  };
}

export type UseProfileScreenReturn = ReturnType<typeof useProfileScreen>;
