import React from "react";
import type { AppDispatch } from "@/redux/store";
import { logNav } from "../../services/logger";
import { fetchAndApplyProfile } from "./loadProfileFromApi";
import type { DraftSetters } from "./loadProfileFromApi";

export function useProfileNavLogging(): void {
  React.useEffect(() => {
    logNav("screen:enter", { screen: "ProfileScreen" });
    return () => logNav("screen:leave", { screen: "ProfileScreen" });
  }, []);
}

export function useProfileUsernameDraftSync(username: string, setDraftUsername: (u: string) => void): void {
  React.useEffect(() => {
    setDraftUsername(username);
  }, [username, setDraftUsername]);
}

export function useProfileInitialLoad(
  accessToken: string | null,
  dispatch: AppDispatch,
  setScreenLoading: (v: boolean) => void,
  drafts: DraftSetters,
): void {
  const draftsRef = React.useRef(drafts);
  draftsRef.current = drafts;
  React.useEffect(() => {
    if (!accessToken) {
      setScreenLoading(false);
      return;
    }
    let isActive = true;
    const run = async () => {
      setScreenLoading(true);
      await fetchAndApplyProfile(accessToken, dispatch, draftsRef.current, () => isActive);
      if (isActive) setScreenLoading(false);
    };
    void run();
    return () => {
      isActive = false;
    };
  }, [accessToken, dispatch, setScreenLoading]);
}
