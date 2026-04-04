import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { useExerciseSingleChoiceState } from "@/hooks/useExerciseSingleChoiceState";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { submitCurriculumExerciseAnswer } from "@/utils/submitCurriculumExerciseAnswer";
import { exerciseMcqStyles } from "./ExerciseMcqView.styles";

type Props = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseMcqView({ exercise, lessonSource, accessToken, onLessonExerciseComplete }: Props) {
  const choice = useExerciseSingleChoiceState(exercise.id, exercise.correctAnswer);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const options = exercise.options.map((option) => option.text);
  const canCheck = !!choice.selected && !choice.hasChecked;

  const runCheck = async () => {
    if (!choice.selected) return;
    if (lessonSource === "personalized") {
      choice.runLocalCheck();
      return;
    }
    if (!accessToken) return;
    const result = await submitCurriculumExerciseAnswer(accessToken, exercise, choice.selected);
    setServerResult(result);
    choice.setIsCorrect(result.isCorrect);
    choice.setHasChecked(true);
  };

  const goNext = () => {
    if (!choice.selected) return;
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(choice.selected, {
        source: "personalized",
        isCorrect: Boolean(choice.isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(choice.selected, { source: "curriculum", submitResult: serverResult });
  };

  const optionStyle = (option: string) => {
    if (lessonSource === "curriculum") {
      if (!choice.hasChecked) return exerciseMcqStyles.option;
      if (choice.selected === option && choice.isCorrect) return [exerciseMcqStyles.option, exerciseMcqStyles.correct];
      if (choice.selected === option && !choice.isCorrect) return [exerciseMcqStyles.option, exerciseMcqStyles.wrong];
      return exerciseMcqStyles.option;
    }
    return [
      exerciseMcqStyles.option,
      choice.selected === option && option === exercise.correctAnswer && exerciseMcqStyles.correct,
      choice.selected === option && option !== exercise.correctAnswer && exerciseMcqStyles.wrong,
    ];
  };

  return (
    <View style={exerciseMcqStyles.exerciseCard}>
      {options.map((option) => (
        <Pressable key={option} style={optionStyle(option)} onPress={() => choice.setSelected(option)}>
          <Text style={exerciseMcqStyles.optionLabel}>{option}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseMcqStyles.lessonButton, !canCheck && exerciseMcqStyles.disabled]}
        disabled={!canCheck}
        onPress={() => void runCheck()}
      >
        <Text style={exerciseMcqStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {choice.hasChecked ? (
        <>
          <Text
            style={[
              exerciseMcqStyles.feedback,
              choice.isCorrect ? exerciseMcqStyles.feedbackGood : exerciseMcqStyles.feedbackBad,
            ]}
          >
            {choice.isCorrect ? "Correct!" : "Not quite."}
          </Text>
          {choice.isCorrect && serverResult?.explanation ? (
            <Text style={exerciseMcqStyles.feedback}>{serverResult.explanation}</Text>
          ) : null}
          <Pressable style={exerciseMcqStyles.lessonButton} onPress={goNext}>
            <Text style={exerciseMcqStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
