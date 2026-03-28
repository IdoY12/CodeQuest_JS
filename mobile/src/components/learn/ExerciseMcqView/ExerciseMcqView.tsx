import React from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useExerciseMcq } from "@/hooks/useExerciseMcq";
import { exerciseMcqStyles } from "./ExerciseMcqView.styles";

type Props = {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseMcqView({ exercise, onAnswer }: Props) {
  const mcq = useExerciseMcq(exercise.id, exercise.correctAnswer);
  const options = exercise.options.map((o) => o.text);
  const canCheck = !!mcq.selected && !mcq.hasChecked;
  const next = () => onAnswer(Boolean(mcq.isCorrect), exercise.xpReward, mcq.selected ?? "");
  return (
    <View style={exerciseMcqStyles.exerciseCard}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => mcq.setSelected(option)}
          style={[
            exerciseMcqStyles.option,
            mcq.selected === option && option === exercise.correctAnswer && exerciseMcqStyles.correct,
            mcq.selected === option && option !== exercise.correctAnswer && exerciseMcqStyles.wrong,
          ]}
        >
          <Text style={exerciseMcqStyles.optionLabel}>{option}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseMcqStyles.lessonButton, !canCheck && exerciseMcqStyles.disabled]}
        disabled={!canCheck}
        onPress={mcq.runCheck}
      >
        <Text style={exerciseMcqStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {mcq.hasChecked ? (
        <>
          <Text
            style={[
              exerciseMcqStyles.feedback,
              mcq.isCorrect ? exerciseMcqStyles.feedbackGood : exerciseMcqStyles.feedbackBad,
            ]}
          >
            {mcq.isCorrect ? "Correct!" : "Not quite."}
          </Text>
          <Pressable style={exerciseMcqStyles.lessonButton} onPress={next}>
            <Text style={exerciseMcqStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
