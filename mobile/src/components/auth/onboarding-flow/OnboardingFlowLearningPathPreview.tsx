import { ActivityIndicator, Text, View } from "react-native";
import { colors, spacing } from "@/theme/theme";
import { OnboardingPathMilestoneChip } from "./OnboardingFlowStepAndChoiceWidgets";
import { onboardingFlowStyles } from "./OnboardingFlow.styles";

const PATH_LABELS = ["Foundations", "Logic", "Projects", "Mastery"] as const;

export function OnboardingLearningPathPreview({
  pathText,
  submitting,
  error,
}: {
  pathText: string;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <>
      <Text style={onboardingFlowStyles.pathText}>{pathText}</Text>
      <View style={onboardingFlowStyles.previewRow}>
        {PATH_LABELS.map((label) => (
          <OnboardingPathMilestoneChip key={label} label={label} />
        ))}
      </View>
      {submitting ? <ActivityIndicator style={{ marginTop: spacing.lg }} color={colors.accent} /> : null}
      {error ? <Text style={onboardingFlowStyles.err}>{error}</Text> : null}
    </>
  );
}
