import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { colors, spacing } from "@/theme/theme";
import type { Commitment } from "@/redux/profile-slice";
import { ONBOARDING_COMMITMENTS } from "@/utils/onboardingCatalog";
import { ObMini } from "./OnboardingFlow.wA";
import { o } from "./OnboardingFlow.styles";

const PATH_LABELS = ["Foundations", "Logic", "Projects", "Mastery"] as const;

export function ObRings({ value, onChange }: { value: Commitment; onChange: (c: Commitment) => void }) {
  return (
    <View style={o.ringRow}>
      {ONBOARDING_COMMITMENTS.map((opt) => (
        <Pressable
          key={opt.key}
          onPress={() => onChange(opt.key)}
          style={[o.ring, value === opt.key && o.ringOn]}
        >
          <Text style={o.ringTitle}>{opt.title}</Text>
          <Text style={o.ringSub}>{opt.subtitle}</Text>
        </Pressable>
      ))}
    </View>
  );
}

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
