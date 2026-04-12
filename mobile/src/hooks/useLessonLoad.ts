import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { logNav } from "@/utils/logger";
import type Exercise from "@/models/Exercise";
import type { Experience } from "@/redux/profile-slice";
import { useAppDispatcher } from "@/redux/hooks";
import { setCurrentExperienceLevel, setExerciseIndex as setSavedExerciseIndex } from "@/redux/lesson-slice";
import { addStudySeconds } from "@/redux/session-slice";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import UserService from "@/services/UserService";
import { drainRefInt } from "@/utils/formatHelpers";
import { runLessonExerciseLoad } from "@/utils/runLessonExerciseLoad";
import { tryPostPracticeLog } from "@/utils/tryPostPracticeLog";

export function useLessonLoad(experienceLevel: Experience, accessToken: string | null, blockIndex: number) {
  const dispatch = useAppDispatcher();
  const user = useAuthenticatedService(UserService);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const isFocused = useIsFocused();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const trackedRef = useRef(0);
  const flushPractice = useCallback(async () => {
    if (!accessToken || trackedRef.current <= 0 || !user) return;
    const seconds = drainRefInt(trackedRef);
    const ok = await tryPostPracticeLog(user, seconds);
    if (!ok) trackedRef.current += seconds;
  }, [accessToken, user]);
  useEffect(() => {
    logNav("screen:enter", { screen: "LessonScreen", experienceLevel });
    return () => logNav("screen:leave", { screen: "LessonScreen", experienceLevel });
  }, [experienceLevel]);
  useEffect(() => {
    dispatch(setCurrentExperienceLevel(experienceLevel));
    let active = true;
    void runLessonExerciseLoad(experienceLevel, accessToken, blockIndex, () => active, setLoading, {
      setExercises,
      setExerciseIndex,
      setCorrectCount,
      setAttemptedCount,
    });
    return () => {
      active = false;
    };
  }, [accessToken, blockIndex, dispatch, experienceLevel]);
  useEffect(() => {
    if (loading || exercises.length === 0) return;
    dispatch(setSavedExerciseIndex(exerciseIndex));
  }, [dispatch, exerciseIndex, exercises.length, loading]);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.current === "active" && next !== "active") void flushPractice();
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [flushPractice]);
  useEffect(() => {
    if (!isFocused || loading || !exercises[exerciseIndex]) return;
    const t = setInterval(() => {
      if (appStateRef.current === "active") {
        trackedRef.current += 1;
        dispatch(addStudySeconds(1));
      }
    }, 1000);
    return () => {
      clearInterval(t);
      void flushPractice();
    };
  }, [dispatch, exerciseIndex, exercises, flushPractice, isFocused, loading]);
  return {
    exercises,
    loading,
    exerciseIndex,
    setExerciseIndex,
    correctCount,
    setCorrectCount,
    attemptedCount,
    setAttemptedCount,
  };
}
