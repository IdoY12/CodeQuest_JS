import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { o } from "./OnboardingFlow.styles";

export function ObStep({
  title,
  onContinue,
  enabled,
  continueLabel = "Continue",
  children,
}: {
  title: string;
  onContinue: () => void;
  enabled: boolean;
  continueLabel?: string;
  children: ReactNode;
}) {
  return (
    <Animated.View entering={SlideInRight.duration(300)} style={o.step}>
      <View style={o.mainContent}>
        <Text style={o.stepTitle}>{title}</Text>
        <ScrollView contentContainerStyle={o.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
      <View style={o.stepFooter}>
        <Pressable disabled={!enabled} onPress={onContinue} style={[o.cta, !enabled && o.ctaDisabled]}>
          <Text style={o.ctaLabel}>{continueLabel}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function ObChoice({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[o.choiceCard, selected && o.choiceCardOn]}>
      <Text style={o.choiceTitle}>{title}</Text>
      <Text style={o.choiceSub}>{subtitle}</Text>
    </Pressable>
  );
}

export function ObMini({ label }: { label: string }) {
  return (
    <View style={o.node}>
      <View style={o.nodeDot} />
      <Text style={o.nodeLabel}>{label}</Text>
    </View>
  );
}
