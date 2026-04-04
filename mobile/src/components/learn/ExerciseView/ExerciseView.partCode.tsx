import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/theme";
import type Exercise from "@/models/Exercise";
import { CODE_FILL_DEFAULT_TOKENS } from "@/constants/codeFillDefaults";
import { useExerciseCodeFill } from "@/hooks/useExerciseCodeFill";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { v } from "./ExerciseView.styles";
import { x } from "./ExerciseView.styles.extra";

type Base = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvCodeFill({ exercise, lessonSource, accessToken, onLessonExerciseComplete }: Base) {
  const u = useExerciseCodeFill(exercise, lessonSource, accessToken, onLessonExerciseComplete);
  const tokens = exercise.options.length > 0 ? exercise.options.map((o) => o.text) : [...CODE_FILL_DEFAULT_TOKENS];
  return (
    <View style={v.exerciseCard}>
      <TextInput
        style={x.input}
        value={u.input}
        onChangeText={u.setInput}
        placeholder="Type answer"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
      />
      <View style={x.suggestionRow}>
        {tokens.map((token) => (
          <Pressable key={token} style={x.token} onPress={() => u.setInput((p) => `${p}${token}`)}>
            <Text style={x.tokenText}>{token}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={[v.lessonButton, !u.canCheck && v.disabled]} disabled={!u.canCheck} onPress={() => void u.runCheck()}>
        <Text style={v.lessonButtonLabel}>Submit</Text>
      </Pressable>
      {u.showResults ? (
        <>
          <Text style={[v.feedback, u.isCorrectNow ? v.feedbackGood : v.feedbackBad]}>
            {u.isCorrectNow ? "Nice work." : "Try another token combination next time."}
          </Text>
          {u.isCorrectNow && u.serverResult?.explanation ? <Text style={v.feedback}>{u.serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={u.goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
