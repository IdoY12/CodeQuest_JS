import { Pressable, Text } from "react-native";
import type { DuelRound } from "@/utils/duelSocketModels";
import { styles } from "./DuelNavigator.styles";

interface DuelActiveAnswerZoneProps {
  round: DuelRound;
  selected: string | null;
  locked: boolean;
  submit: (answer: string) => void;
}

export function DuelActiveAnswerZone({ round, selected, locked, submit }: DuelActiveAnswerZoneProps) {
  if (round.type === "FIND_THE_BUG") {
    return round.codeSnippet.split("\n").map((line, idx) => (
      <Pressable
        key={`${line}-${idx}`}
        style={[styles.option, selected === String(idx + 1) && styles.optionSelected]}
        onPress={() => submit(String(idx + 1))}
        disabled={locked}
      >
        <Text style={styles.optionLabel} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.9}>
          {idx + 1}. {line}
        </Text>
      </Pressable>
    ));
  }

  return round.options.map((option) => (
    <Pressable
      key={option}
      style={[styles.option, selected === option && styles.optionSelected]}
      onPress={() => submit(option)}
      disabled={locked}
    >
      <Text style={styles.optionLabel} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.9}>
        {option}
      </Text>
    </Pressable>
  ));
}
