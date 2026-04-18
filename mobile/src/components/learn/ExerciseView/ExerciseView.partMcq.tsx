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
    // Red/green only for what was ACTUALLY SUBMITTED — never for the current tap target.
    if (u.lastCheckedAnswer === opt && u.isCorrect) return [v.option, v.correct];

    if (u.lastCheckedAnswer === opt && !u.isCorrect && u.hasChecked) return [v.option, v.wrong];
    // Neutral accent border so the user can see their tap registered before re-checking.
    if (u.selected === opt) return [v.option, v.optionSelected];

    return v.option;
  };

  const ok = variant === "tap_token" ? "Token identified." : "Correct!";

  return (
    <View style={v.exerciseCard}>
      {variant === "tap_token" ? <Text style={v.hint}>Tap the correct token from this list.</Text> : null}
      {u.options.map((opt, i) => (
        <Pressable key={`${opt}-${i}`} style={styleFor(opt)} onPress={() => u.setSelected(opt)} disabled={u.isCorrect === true}>
          <Text style={v.optionLabel}>{opt}</Text>
        </Pressable>
      ))}
      <Pressable style={[v.lessonButton, !u.canCheck && v.disabled]} disabled={!u.canCheck} onPress={() => void u.runCheck()}>
        <Text style={v.lessonButtonLabel}>Check</Text>
      </Pressable>
      {u.hasChecked && u.isCorrect ? (
        <>
          <Text style={[v.feedback, v.feedbackGood]}>{ok}</Text>
          {u.serverResult?.explanation ? <Text style={v.feedback}>{u.serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={u.goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : u.hasChecked ? (
        <Text style={[v.feedback, v.feedbackBad]}>Try again.</Text>
      ) : null}
    </View>
  );
}
