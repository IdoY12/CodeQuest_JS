import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import type Exercise from "@/models/Exercise";
import { drainRefInt } from "../utils/drainRefInt";
import { postPracticeLog } from "../utils/postPracticeLog";

export function useLessonPracticeTimer(
  accessToken: string | null,
  exercise: Exercise | undefined,
  loading: boolean,
) {
  const isFocused = useIsFocused();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const trackedSecondsRef = useRef(0);

  const flushPracticeSeconds = useCallback(async () => {
    if (!accessToken || trackedSecondsRef.current <= 0) return;
    const seconds = drainRefInt(trackedSecondsRef);
    const ok = await postPracticeLog(accessToken, seconds);
    if (!ok) trackedSecondsRef.current += seconds;
  }, [accessToken]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.current === "active" && next !== "active") void flushPracticeSeconds();
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [flushPracticeSeconds]);

  useEffect(() => {
    if (!isFocused || loading || !exercise) return;
    const timer = setInterval(() => {
      if (appStateRef.current === "active") trackedSecondsRef.current += 1;
    }, 1000);
    return () => {
      clearInterval(timer);
      void flushPracticeSeconds();
    };
  }, [exercise?.id, flushPracticeSeconds, isFocused, loading]);

  return { flushPracticeSeconds };
}
