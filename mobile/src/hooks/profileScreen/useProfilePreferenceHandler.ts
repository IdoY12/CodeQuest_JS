import React from "react";
import { useAppDispatch } from "../../store/hooks";
import { patchUserPreferences } from "./savePreferencesRequest";
import type { useProfileDraftState } from "./useProfileDraftState";
import type { useProfileRedux } from "./useProfileRedux";

type R = ReturnType<typeof useProfileRedux>;
type D = ReturnType<typeof useProfileDraftState>;

export function useProfilePreferenceHandler(r: R, d: D) {
  const dispatch = useAppDispatch();
  return React.useCallback(async () => {
    if (!r.accessToken || d.saving) return;
    d.setSaving(true);
    d.setSaveMessage(null);
    await patchUserPreferences(
      r.accessToken,
      d.draftGoal,
      d.draftLevel,
      d.draftCommitment,
      d.draftNotifications,
      dispatch,
      d.setSaveMessage,
    );
    d.setSaving(false);
  }, [
    r.accessToken,
    d.saving,
    d.draftGoal,
    d.draftLevel,
    d.draftCommitment,
    d.draftNotifications,
    dispatch,
    d.setSaving,
    d.setSaveMessage,
  ]);
}
