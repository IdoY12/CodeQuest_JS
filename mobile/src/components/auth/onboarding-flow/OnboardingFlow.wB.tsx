import { ActivityIndicator, Text, View } from "react-native";
import { colors, spacing } from "@/theme/theme";
import { ObMini } from "./OnboardingFlow.wA";
import { o } from "./OnboardingFlow.styles";

const PATH_LABELS = ["Foundations", "Logic", "Projects", "Mastery"] as const;

export function ObPath({ pathText, submitting, error }: { pathText: string; submitting: boolean; error: string | null }) {
  return (
    <>
      <Text style={o.pathText}>{pathText}</Text>
      <View style={o.previewRow}>
        {PATH_LABELS.map((label) => (
          <ObMini key={label} label={label} />
        ))}
      </View>
      {submitting ? <ActivityIndicator style={{ marginTop: spacing.lg }} color={colors.accent} /> : null}
      {error ? <Text style={o.err}>{error}</Text> : null}
    </>
  );
}
