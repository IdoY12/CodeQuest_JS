import React from "react";
import { Text, View } from "react-native";
import type { StatItem } from "@/types/profile.types";
import { profileStatPillStyles } from "./ProfileStatPill.styles";

type Props = { item: StatItem };

export function ProfileStatPill({ item }: Props) {
  return (
    <View style={profileStatPillStyles.statPill}>
      <Text style={profileStatPillStyles.statIcon}>{item.icon}</Text>
      <Text style={profileStatPillStyles.statPillValue}>{item.value}</Text>
      <Text style={profileStatPillStyles.statPillLabel}>{item.label}</Text>
    </View>
  );
}
