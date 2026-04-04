import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/theme";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { CODE_FILL_DEFAULT_TOKENS } from "@/constants/codeFillDefaults";
import { useExerciseCodeFill } from "@/hooks/useExerciseCodeFill";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { submitCurriculumExerciseAnswer } from "@/utils/submitCurriculumExerciseAnswer";
import { exerciseCodeFillStyles } from "./ExerciseCodeFillView.styles";

type Props = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseCodeFillView({ exercise, lessonSource, accessToken, onLessonExerciseComplete }: Props) {
  const cf = useExerciseCodeFill(exercise.id, exercise.correctAnswer ?? "");
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  const tokens =
    exercise.options.length > 0 ? exercise.options.map((option) => option.text) : [...CODE_FILL_DEFAULT_TOKENS];
  const canCheckPersonalized = cf.input.trim().length > 0 && !cf.hasChecked;
  const canCheckCurriculum = cf.input.trim().length > 0 && !curriculumChecked;
  const canCheck = lessonSource === "personalized" ? canCheckPersonalized : canCheckCurriculum;

  const runCheck = async () => {
    if (lessonSource === "personalized") {
      cf.runCheck();
      return;
    }
    if (!accessToken) return;
    const result = await submitCurriculumExerciseAnswer(accessToken, exercise, cf.input.trim());
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };

  const goNext = () => {
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(cf.input, {
        source: "personalized",
        isCorrect: Boolean(cf.isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(cf.input.trim(), { source: "curriculum", submitResult: serverResult });
  };

  const showResults = lessonSource === "personalized" ? cf.hasChecked : curriculumChecked;
  const isCorrectNow = lessonSource === "personalized" ? cf.isCorrect : curriculumCorrect;

  const append = (token: string) => cf.setInput((previous) => `${previous}${token}`);

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
        onPress={() => void runCheck()}
      >
        <Text style={exerciseCodeFillStyles.lessonButtonLabel}>Submit</Text>
      </Pressable>
      {showResults ? (
        <>
          <Text
            style={[
              exerciseCodeFillStyles.feedback,
              isCorrectNow ? exerciseCodeFillStyles.feedbackGood : exerciseCodeFillStyles.feedbackBad,
            ]}
          >
            {isCorrectNow ? "Nice work." : "Try another token combination next time."}
          </Text>
          {isCorrectNow && serverResult?.explanation ? (
            <Text style={exerciseCodeFillStyles.feedback}>{serverResult.explanation}</Text>
          ) : null}
          <Pressable style={exerciseCodeFillStyles.lessonButton} onPress={goNext}>
            <Text style={exerciseCodeFillStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
