import React from "react";
import { Pressable, Text, View } from "react-native";
import type { SettingRowProps } from "@/types/profile.types";
import { profileFormRowsStyles } from "../ProfileFormRows/ProfileFormRows.styles";
import { settingRowStyles } from "./SettingRow.styles";

export const SettingRow = React.memo(function SettingRow({ icon, label, subtitle, onPress, labelStyle }: SettingRowProps) {
  return (
    <Pressable style={({ pressed }) => [settingRowStyles.settingRow, pressed && settingRowStyles.settingPressed]} onPress={onPress}>
      <View style={profileFormRowsStyles.rowLeft}>
        <Text style={profileFormRowsStyles.rowIcon}>{icon}</Text>
        <View>
          <Text style={[profileFormRowsStyles.rowText, labelStyle]}>{label}</Text>
          {subtitle ? <Text style={profileFormRowsStyles.rowSubText}>{subtitle}</Text> : null}
        </View>
      </View>
      <Text style={settingRowStyles.chevron}>›</Text>
    </Pressable>
  );
});
