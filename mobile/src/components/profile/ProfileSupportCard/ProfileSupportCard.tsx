import React from "react";
import { Text, View } from "react-native";
import type { SupportRowItem } from "@/types/profile.types";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";
import { openSupportUrl } from "@/utils/openSupportUrl";
import { SettingRow } from "@/components/profile/SettingRow/SettingRow";

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
