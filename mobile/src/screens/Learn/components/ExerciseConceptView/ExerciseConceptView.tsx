import React from "react";
import { Pressable, Text, View } from "react-native";
import type { ApiExercise } from "@/types/learn.types";
import { exerciseConceptStyles } from "./ExerciseConceptView.styles";

type Props = {
  exercise: ApiExercise;
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseConceptView({ exercise, onAnswer }: Props) {
  const submit = () => onAnswer(true, exercise.xpReward, "concept-card");
  return (
    <View style={exerciseConceptStyles.exerciseCard}>
      <Text style={exerciseConceptStyles.explanation}>{exercise.explanation}</Text>
      <Pressable style={exerciseConceptStyles.lessonButton} onPress={submit}>
        <Text style={exerciseConceptStyles.lessonButtonLabel}>Got it</Text>
      </Pressable>
    </View>
  );
}
