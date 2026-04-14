import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingWizard } from "@/hooks/useOnboardingWizard";
import { logOnboarding } from "@/utils/logger";
import { ONBOARDING_COMMITMENTS, ONBOARDING_GOALS, ONBOARDING_LEVELS } from "@/utils/onboardingCatalog";
import { ObChoice, ObStep } from "./OnboardingFlow.wA";
import { ObPath } from "./OnboardingFlow.wB";
import { o } from "./OnboardingFlow.styles";

export function OnboardingFlow() {
  const wizard = useOnboardingWizard();
  return (
    <SafeAreaView style={o.container} edges={["top", "bottom"]}>
      {wizard.step === 1 && (
        <ObStep
          title="What's your level?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 1, level: wizard.level });
            wizard.setStep(2);
          }}
          enabled={!!wizard.level}
        >
          {ONBOARDING_LEVELS.map((opt) => (
            <ObChoice
              key={opt.key}
              selected={wizard.level === opt.key}
              title={opt.title}
              subtitle={opt.subtitle}
              onPress={() => wizard.setLevel(opt.key)}
            />
          ))}
        </ObStep>
      )}
      {wizard.step === 2 && (
        <ObStep
          title="What is your goal?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 2, goal: wizard.goal });
            wizard.setStep(3);
          }}
          enabled={!!wizard.goal}
        >
          {ONBOARDING_GOALS.map((opt) => (
            <ObChoice
              key={opt.key}
              selected={wizard.goal === opt.key}
              title={opt.title}
              subtitle={opt.subtitle}
              onPress={() => wizard.setGoal(opt.key)}
            />
          ))}
        </ObStep>
      )}
      {wizard.step === 3 && (
        <ObStep
          title="How many minutes do you plan to study per day?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 3, commitment: wizard.commitment });
            wizard.submitOnboarding();
          }}
          enabled
          continueLabel={wizard.submitting ? "Saving..." : "Get Started"}
        >
          {ONBOARDING_COMMITMENTS.map((opt) => (
            <ObChoice
              key={opt.key}
              selected={wizard.commitment === opt.key}
              title={opt.title}
              subtitle={opt.subtitle}
              onPress={() => wizard.setCommitment(opt.key)}
            />
          ))}
          <ObPath pathText={wizard.pathText} submitting={wizard.submitting} error={wizard.error} />
        </ObStep>
      )}
    </SafeAreaView>
  );
}
