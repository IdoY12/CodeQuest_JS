import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingWizard } from "@/hooks/useOnboardingWizard";
import { logOnboarding } from "@/utils/logger";
import { ONBOARDING_GOALS, ONBOARDING_LEVELS } from "@/utils/onboardingCatalog";
import { ObChoice, ObStep } from "./OnboardingFlow.wA";
import { ObPath, ObRings } from "./OnboardingFlow.wB";
import { o } from "./OnboardingFlow.styles";

export function OnboardingFlow() {
  const w = useOnboardingWizard();
  return (
    <SafeAreaView style={o.container} edges={["top", "bottom"]}>
      {w.step === 1 && (
        <ObStep
          title="What brings you to CodeQuest?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 1, goal: w.goal });
            w.setStep(2);
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
      {w.step === 2 && (
        <ObStep
          title="How comfortable are you with JavaScript?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 2, level: w.level });
            w.setStep(3);
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
      {w.step === 3 && (
        <ObStep
          title="How much time can you dedicate daily?"
          onContinue={() => {
            logOnboarding("step:complete", { step: 3, commitment: w.commitment });
            w.setStep(4);
          }}
          enabled
        >
          <ObRings value={w.commitment} onChange={w.setCommitment} />
        </ObStep>
      )}
      {w.step === 4 && (
        <ObStep
          title="Your path is ready"
          onContinue={w.submitOnboarding}
          enabled={!!w.goal && !!w.level}
          continueLabel={w.submitting ? "Saving..." : "Start My Path"}
        >
          <ObPath pathText={w.pathText} submitting={w.submitting} error={w.error} />
        </ObStep>
      )}
    </SafeAreaView>
  );
}
