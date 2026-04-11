import React from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useExerciseSingleChoice } from "@/hooks/useExerciseSingleChoice";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { v } from "./ExerciseView.styles";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvMcqTap({
  variant,
  exercise,
  accessToken,
  onLessonExerciseComplete,
}: Base & { variant: "mcq" | "tap_token" }) {
  const u = useExerciseSingleChoice(exercise, variant, accessToken, onLessonExerciseComplete);
  const styleFor = (opt: string) => {
    if (!u.hasChecked) return v.option;
    if (u.selected === opt && u.isCorrect) return [v.option, v.correct];
    if (u.selected === opt && !u.isCorrect) return [v.option, v.wrong];
    return v.option;
  };
  const ok = variant === "tap_token" ? "Token identified." : "Correct!";
  const bad = variant === "tap_token" ? "Wrong token. Continue and review." : "Not quite.";
  return (
    <View style={v.exerciseCard}>
      {variant === "tap_token" ? <Text style={v.hint}>Tap the correct token from this list.</Text> : null}
      {u.options.map((opt, i) => (
        <Pressable key={`${opt}-${i}`} style={styleFor(opt)} onPress={() => u.setSelected(opt)}>
          <Text style={v.optionLabel}>{opt}</Text>
        </Pressable>
      ))}
      <Pressable style={[v.lessonButton, !u.canCheck && v.disabled]} disabled={!u.canCheck} onPress={() => void u.runCheck()}>
        <Text style={v.lessonButtonLabel}>Check</Text>
      </Pressable>
      {u.hasChecked ? (
        <>
          <Text style={[v.feedback, u.isCorrect ? v.feedbackGood : v.feedbackBad]}>{u.isCorrect ? ok : bad}</Text>
          {u.isCorrect && u.serverResult?.explanation ? <Text style={v.feedback}>{u.serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={u.goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
