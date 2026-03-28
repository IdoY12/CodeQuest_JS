import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/theme";
import type { ApiExercise } from "@/types/learn.types";
import { CODE_FILL_DEFAULT_TOKENS } from "@/constants/codeFillDefaults";
import { useExerciseCodeFill } from "@/hooks/useExerciseCodeFill";
import { exerciseCodeFillStyles } from "./ExerciseCodeFillView.styles";

type Props = {
  exercise: ApiExercise;
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseCodeFillView({ exercise, onAnswer }: Props) {
  const cf = useExerciseCodeFill(exercise.id, exercise.correctAnswer);
  const tokens =
    exercise.options.length > 0 ? exercise.options.map((o) => o.text) : [...CODE_FILL_DEFAULT_TOKENS];
  const canCheck = cf.input.trim().length > 0 && !cf.hasChecked;
  const next = () => onAnswer(Boolean(cf.isCorrect), exercise.xpReward, cf.input);
  const append = (t: string) => cf.setInput((v) => `${v}${t}`);
  return (
    <View style={exerciseCodeFillStyles.exerciseCard}>
      <TextInput
        style={exerciseCodeFillStyles.input}
        value={cf.input}
        onChangeText={cf.setInput}
        placeholder="Type answer"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
      />
      <View style={exerciseCodeFillStyles.suggestionRow}>
        {tokens.map((token) => (
          <Pressable key={token} style={exerciseCodeFillStyles.token} onPress={() => append(token)}>
            <Text style={exerciseCodeFillStyles.tokenText}>{token}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={[exerciseCodeFillStyles.lessonButton, !canCheck && exerciseCodeFillStyles.disabled]}
        disabled={!canCheck}
        onPress={cf.runCheck}
      >
        <Text style={exerciseCodeFillStyles.lessonButtonLabel}>Submit</Text>
      </Pressable>
      {cf.hasChecked ? (
        <>
          <Text
            style={[
              exerciseCodeFillStyles.feedback,
              cf.isCorrect ? exerciseCodeFillStyles.feedbackGood : exerciseCodeFillStyles.feedbackBad,
            ]}
          >
            {cf.isCorrect ? "Nice work." : "Try another token combination next time."}
          </Text>
          <Pressable style={exerciseCodeFillStyles.lessonButton} onPress={next}>
            <Text style={exerciseCodeFillStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
