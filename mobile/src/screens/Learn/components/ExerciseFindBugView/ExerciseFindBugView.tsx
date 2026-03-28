import React from "react";
import { Pressable, Text, View } from "react-native";
import type { ApiExercise } from "@/types/learn.types";
import { useExerciseFindBug } from "@/hooks/useExerciseFindBug";
import { exerciseFindBugStyles } from "./ExerciseFindBugView.styles";

type Props = {
  exercise: ApiExercise;
  lineList: string[];
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseFindBugView({ exercise, lineList, onAnswer }: Props) {
  const bug = useExerciseFindBug(exercise.id, exercise.correctAnswer);
  const canCheck = !!bug.selected && !bug.hasChecked;
  const next = () => onAnswer(Boolean(bug.isCorrect), exercise.xpReward, bug.selected ?? "");
  return (
    <View style={exerciseFindBugStyles.exerciseCard}>
      <Text style={exerciseFindBugStyles.hearts}>{"❤️".repeat(Math.max(0, bug.attemptsLeft))}</Text>
      {lineList.map((line, idx) => (
        <Pressable
          key={`${line}-${idx}`}
          onPress={() => bug.setSelected(String(idx + 1))}
          style={[
            exerciseFindBugStyles.line,
            bug.selected === String(idx + 1) && exerciseFindBugStyles.lineSelected,
          ]}
        >
          <Text style={exerciseFindBugStyles.lineText}>
            {idx + 1}. {line}
          </Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseFindBugStyles.lessonButton, !canCheck && exerciseFindBugStyles.disabled]}
        disabled={!canCheck}
        onPress={bug.runCheck}
      >
        <Text style={exerciseFindBugStyles.lessonButtonLabel}>Check Line</Text>
      </Pressable>
      {bug.hasChecked ? (
        <>
          <Text
            style={[
              exerciseFindBugStyles.feedback,
              bug.isCorrect ? exerciseFindBugStyles.feedbackGood : exerciseFindBugStyles.feedbackBad,
            ]}
          >
            {bug.isCorrect ? "Great catch." : "Bug revealed. Review explanation and continue."}
          </Text>
          <Pressable style={exerciseFindBugStyles.lessonButton} onPress={next}>
            <Text style={exerciseFindBugStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
