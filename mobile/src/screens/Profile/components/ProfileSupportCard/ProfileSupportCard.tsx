import React from "react";
import { Text, View } from "react-native";
import type { SupportRowItem } from "@/types/profile.types";
import { profileSectionCardStyles } from "../ProfileSectionCard/ProfileSectionCard.styles";
import { SettingRow } from "../SettingRow/SettingRow";
import { openSupportUrl } from "./openSupportUrl";

export type ProfileSupportCardProps = { supportRows: SupportRowItem[] };

export function ProfileSupportCard({ supportRows }: ProfileSupportCardProps) {
  return (
    <View style={profileSectionCardStyles.card}>
      <Text style={profileSectionCardStyles.sectionHeader}>Support</Text>
      {supportRows.map((row) => (
        <SettingRow key={row.label} icon={row.icon} label={row.label} onPress={() => openSupportUrl(row.url)} />
      ))}
    </View>
  );
}
