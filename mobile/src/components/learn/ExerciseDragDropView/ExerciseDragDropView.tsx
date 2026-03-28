import React from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useExerciseDragDrop } from "@/hooks/useExerciseDragDrop";
import { exerciseDragDropStyles } from "./ExerciseDragDropView.styles";

type Props = {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseDragDropView({ exercise, onAnswer }: Props) {
  const dd = useExerciseDragDrop(exercise.id, exercise.codeSnippet);
  const canCheck = dd.orderedSelection.length === dd.lineList.length && !dd.hasChecked;
  const next = () => onAnswer(Boolean(dd.isCorrect), exercise.xpReward, dd.normalizedAnswer);
  return (
    <View style={exerciseDragDropStyles.exerciseCard}>
      <Text style={exerciseDragDropStyles.explanation}>
        Build the answer above. Tap a selected line to remove it.
      </Text>
      <View style={exerciseDragDropStyles.answerZone}>
        <Text style={exerciseDragDropStyles.answerZoneTitle}>
          Answer Zone ({dd.orderedSelection.length}/{dd.lineList.length})
        </Text>
        {dd.orderedSelection.length === 0 ? (
          <Text style={exerciseDragDropStyles.answerPreview}>No lines selected yet.</Text>
        ) : (
          dd.orderedSelection.map((line, idx) => (
            <Pressable
              key={`${line}-${idx}`}
              style={exerciseDragDropStyles.selectedLine}
              onPress={() => dd.removeLine(idx, line)}
            >
              <Text style={exerciseDragDropStyles.lineText}>{line}</Text>
              <Text style={exerciseDragDropStyles.removeIcon}>×</Text>
            </Pressable>
          ))
        )}
      </View>
      <Text style={exerciseDragDropStyles.answerZoneTitle}>Line Pool</Text>
      {dd.poolLines.map((line, idx) => (
        <Pressable key={`${line}-${idx}`} style={exerciseDragDropStyles.option} onPress={() => dd.addLine(line, idx)}>
          <Text style={exerciseDragDropStyles.optionLabel}>{line}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseDragDropStyles.secondaryAction, dd.orderedSelection.length === 0 && exerciseDragDropStyles.disabled]}
        disabled={dd.orderedSelection.length === 0}
        onPress={dd.resetOrder}
      >
        <Text style={exerciseDragDropStyles.secondaryActionLabel}>Reset</Text>
      </Pressable>
      <Pressable
        style={[exerciseDragDropStyles.lessonButton, !canCheck && exerciseDragDropStyles.disabled]}
        disabled={!canCheck}
        onPress={() => dd.runCheck(exercise.correctAnswer)}
      >
        <Text style={exerciseDragDropStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {dd.hasChecked ? (
        <>
          <Text
            style={[
              exerciseDragDropStyles.feedback,
              dd.isCorrect ? exerciseDragDropStyles.feedbackGood : exerciseDragDropStyles.feedbackBad,
            ]}
          >
            {dd.isCorrect ? "Perfect order." : "Order is incorrect. Reset and try again, or continue."}
          </Text>
          <Pressable style={exerciseDragDropStyles.lessonButton} onPress={next}>
            <Text style={exerciseDragDropStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
