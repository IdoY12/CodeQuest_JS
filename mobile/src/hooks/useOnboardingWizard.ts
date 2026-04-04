import { useEffect, useMemo, useState } from "react";
import { logError, logNav, logOnboarding } from "@/services/logger";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import type { Commitment, Experience, Goal } from "@/redux/profile-slice";
import { completeOnboarding, setOnboarding } from "@/redux/profile-slice";
import { setOnboardingCompleted } from "@/redux/session-slice";
import { useService } from "@/hooks/useService";
import UserService from "@/services/UserService";

export function useOnboardingWizard() {
  const dispatch = useAppDispatcher();
  const user = useService(UserService);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | undefined>(undefined);
  const [level, setLevel] = useState<Experience | undefined>(undefined);
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
      level === "ADVANCED"
        ? "We will throw you into Express APIs, async patterns, and advanced debugging."
        : "We will start with fundamentals: variables, loops, and functions through interactive challenges.",
    [level],
  );
  const submitOnboarding = async () => {
    if (!goal || !level || !accessToken || submitting) return;
    logOnboarding("submit:start", { step, hasToken: Boolean(accessToken), goal, level, commitment });
    setSubmitting(true);
    setError(null);
    try {
      const response = await user.postOnboarding(goal, level, Number(commitment));
      dispatch(setOnboarding({ goal, experience: level, commitment }));
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
    goal,
    setGoal,
    level,
    setLevel,
    commitment,
    setCommitment,
    accessToken,
    submitting,
    error,
    pathText,
    submitOnboarding,
  };
}
