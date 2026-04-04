import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { useExerciseSingleChoiceState } from "@/hooks/useExerciseSingleChoiceState";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { submitCurriculumExerciseAnswer } from "@/utils/submitCurriculumExerciseAnswer";
import { exerciseTapTokenStyles } from "./ExerciseTapTokenView.styles";

type Props = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseTapTokenView({ exercise, lessonSource, accessToken, onLessonExerciseComplete }: Props) {
  const choice = useExerciseSingleChoiceState(exercise.id, exercise.correctAnswer);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const tokenOptions = useMemo(
    () =>
      exercise.options.length > 0
        ? exercise.options.map((option) => option.text)
        : exercise.codeSnippet.split(" "),
    [exercise.codeSnippet, exercise.options],
  );
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

  return (
    <View style={exerciseTapTokenStyles.exerciseCard}>
      <Text style={exerciseTapTokenStyles.explanation}>Tap the correct token from this list.</Text>
      {tokenOptions.map((token, index) => (
        <Pressable key={`${token}-${index}`} style={exerciseTapTokenStyles.option} onPress={() => choice.setSelected(token)}>
          <Text style={exerciseTapTokenStyles.optionLabel}>{token}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseTapTokenStyles.lessonButton, !canCheck && exerciseTapTokenStyles.disabled]}
        disabled={!canCheck}
        onPress={() => void runCheck()}
      >
        <Text style={exerciseTapTokenStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {choice.hasChecked ? (
        <>
          <Text
            style={[
              exerciseTapTokenStyles.feedback,
              choice.isCorrect ? exerciseTapTokenStyles.feedbackGood : exerciseTapTokenStyles.feedbackBad,
            ]}
          >
            {choice.isCorrect ? "Token identified." : "Wrong token. Continue and review."}
          </Text>
          {choice.isCorrect && serverResult?.explanation ? (
            <Text style={exerciseTapTokenStyles.feedback}>{serverResult.explanation}</Text>
          ) : null}
          <Pressable style={exerciseTapTokenStyles.lessonButton} onPress={goNext}>
            <Text style={exerciseTapTokenStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
