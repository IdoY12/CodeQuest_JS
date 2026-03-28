import React from "react";
import { Pressable, Text, View } from "react-native";
import type { OptionRowProps } from "@/types/profile.types";
import { optionRowStyles } from "./OptionRow.styles";

export const OptionRow = React.memo(function OptionRow({ values, selected, onSelect }: OptionRowProps) {
  return (
    <View style={optionRowStyles.optionRow}>
      {values.map((value) => (
        <Pressable
          key={value.key}
          onPress={() => onSelect(value.key)}
          style={[optionRowStyles.choiceChip, selected === value.key && optionRowStyles.choiceChipSelected]}
        >
          <Text style={[optionRowStyles.choiceChipLabel, selected === value.key && optionRowStyles.choiceChipLabelSelected]}>
            {value.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
});
