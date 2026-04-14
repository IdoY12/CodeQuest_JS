import { useEffect, useMemo, useState } from "react";
import { logError, logNav, logOnboarding } from "@/utils/logger";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Commitment, Experience, Goal } from "@/redux/profile-slice";
import { completeOnboarding, setOnboarding } from "@/redux/profile-slice";
import { setOnboardingCompleted } from "@/redux/session-slice";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import UserService from "@/services/UserService";

export function useOnboardingWizard() {
  const dispatch = useAppDispatch();
  const user = useAuthenticatedService(UserService);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState<Experience | undefined>(undefined);
  const [goal, setGoal] = useState<Goal | undefined>(undefined);
  const [commitment, setCommitment] = useState<Commitment>("15");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    logNav("screen:enter", { screen: "OnboardingFlow" });
    return () => logNav("screen:leave", { screen: "OnboardingFlow" });
  }, []);
  useEffect(() => {
    logOnboarding("step:view", { step });
  }, [step]);
  const pathText = useMemo(
    () =>
      level === "SENIOR"
        ? "You will get advanced async patterns, architecture, and performance-focused practice."
        : level === "MID"
          ? "You will practice closures, async/await, and moderate algorithm challenges."
          : "You will start with fundamentals: variables, loops, and simple functions.",
    [level],
  );
  const submitOnboarding = async () => {
    if (!level || !goal || submitting) return;
    logOnboarding("submit:start", { step, hasToken: Boolean(accessToken), goal, level, commitment });
    setSubmitting(true);
    setError(null);
    try {
      dispatch(setOnboarding({ goal, experience: level, commitment }));
      if (accessToken && user) {
        const response = await user.postOnboarding(goal, level, Number(commitment));
        if (!response.onboardingCompleted) {
          setError("Onboarding not completed");
          return;
        }
        logOnboarding("submit:success", { pathKey: response.pathKey });
        dispatch(
          completeOnboarding({
            path: response.pathKey,
            goal,
            experience: level,
            commitment,
            notificationsEnabled: true,
          }),
        );
      } else {
        dispatch(completeOnboarding({ path: level, goal, experience: level, commitment, notificationsEnabled: true }));
      }
      dispatch(setOnboardingCompleted(true));
    } catch (e) {
      logError("[ONBOARDING]", e, { phase: "submit" });
      setError(e instanceof Error ? e.message : "We could not save your setup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return {
    step,
    setStep,
    level,
    setLevel,
    goal,
    setGoal,
    commitment,
    setCommitment,
    accessToken,
    submitting,
    error,
    pathText,
    submitOnboarding,
  };
}
