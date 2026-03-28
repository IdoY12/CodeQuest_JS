import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useExerciseTapToken } from "@/hooks/useExerciseTapToken";
import { exerciseTapTokenStyles } from "./ExerciseTapTokenView.styles";

type Props = {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseTapTokenView({ exercise, onAnswer }: Props) {
  const tap = useExerciseTapToken(exercise.id, exercise.correctAnswer);
  const tokenOptions = useMemo(
    () =>
      exercise.options.length > 0
        ? exercise.options.map((o) => o.text)
        : exercise.codeSnippet.split(" "),
    [exercise.codeSnippet, exercise.options],
  );
  const canCheck = !!tap.selected && !tap.hasChecked;
  const next = () => onAnswer(Boolean(tap.isCorrect), exercise.xpReward, tap.selected ?? "");
  return (
    <View style={exerciseTapTokenStyles.exerciseCard}>
      <Text style={exerciseTapTokenStyles.explanation}>Tap the correct token from this list.</Text>
      {tokenOptions.map((token, idx) => (
        <Pressable key={`${token}-${idx}`} style={exerciseTapTokenStyles.option} onPress={() => tap.setSelected(token)}>
          <Text style={exerciseTapTokenStyles.optionLabel}>{token}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseTapTokenStyles.lessonButton, !canCheck && exerciseTapTokenStyles.disabled]}
        disabled={!canCheck}
        onPress={tap.runCheck}
      >
        <Text style={exerciseTapTokenStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {tap.hasChecked ? (
        <>
          <Text
            style={[
              exerciseTapTokenStyles.feedback,
              tap.isCorrect ? exerciseTapTokenStyles.feedbackGood : exerciseTapTokenStyles.feedbackBad,
            ]}
          >
            {tap.isCorrect ? "Token identified." : "Wrong token. Continue and review."}
          </Text>
          <Pressable style={exerciseTapTokenStyles.lessonButton} onPress={next}>
            <Text style={exerciseTapTokenStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
