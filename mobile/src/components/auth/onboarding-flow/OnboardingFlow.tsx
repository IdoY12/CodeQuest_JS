import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingWizard } from "@/hooks/useOnboardingWizard";
import { logOnboarding } from "@/utils/logger";
import { ONBOARDING_COMMITMENTS, ONBOARDING_GOALS, ONBOARDING_LEVELS } from "@/utils/onboardingCatalog";
import { ObChoice, ObStep } from "./OnboardingFlow.wA";
import { ObPath } from "./OnboardingFlow.wB";
import { o } from "./OnboardingFlow.styles";

export function OnboardingFlow() {
  const w = useOnboardingWizard();
  return (
    <SafeAreaView style={o.container} edges={["top", "bottom"]}>
      {w.step === 1 && (
        <ObStep
          title="What's your level?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 1, level: w.level });
            w.setStep(2);
          }}
          enabled={!!w.level}
        >
          {ONBOARDING_LEVELS.map((opt) => (
            <ObChoice
              key={opt.key}
              selected={w.level === opt.key}
              title={opt.title}
              subtitle={opt.subtitle}
              onPress={() => w.setLevel(opt.key)}
            />
          ))}
        </ObStep>
      )}
      {w.step === 2 && (
        <ObStep
          title="What is your goal?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 2, goal: w.goal });
            w.setStep(3);
          }}
          enabled={!!w.goal}
        >
          {ONBOARDING_GOALS.map((opt) => (
            <ObChoice
              key={opt.key}
              selected={w.goal === opt.key}
              title={opt.title}
              subtitle={opt.subtitle}
              onPress={() => w.setGoal(opt.key)}
            />
          ))}
        </ObStep>
      )}
      {w.step === 3 && (
        <ObStep
          title="How many minutes do you plan to study per day?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 3, commitment: w.commitment });
            w.submitOnboarding();
          }}
          enabled
          continueLabel={w.submitting ? "Saving..." : "Get Started"}
        >
          {ONBOARDING_COMMITMENTS.map((opt) => (
            <ObChoice
              key={opt.key}
              selected={w.commitment === opt.key}
              title={opt.title}
              subtitle={opt.subtitle}
              onPress={() => w.setCommitment(opt.key)}
            />
          ))}
          <ObPath pathText={w.pathText} submitting={w.submitting} error={w.error} />
        </ObStep>
      )}
    </SafeAreaView>
  );
}
