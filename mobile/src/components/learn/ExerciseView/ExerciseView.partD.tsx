import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useBuiltAnswerLessonExercise } from "@/hooks/useBuiltAnswerLessonExercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { v } from "./ExerciseView.styles";
import { x } from "./ExerciseView.styles.extra";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvLineOrdering({ exercise, accessToken, onLessonExerciseComplete }: Base) {
  const { lineOrder: lo, canCheck, runCheck, goNext, hasChecked, isAnswerCorrect, serverResult } = useBuiltAnswerLessonExercise(
    exercise,
    accessToken,
    onLessonExerciseComplete,
  );

  return (
    <View style={v.exerciseCard}>
      <Text style={v.explanation}>Build the answer above. Tap a selected line to remove it.</Text>
      <View style={x.answerZone}>
        <Text style={x.answerZoneTitle}>
          Answer Zone ({lo.orderedSelection.length}/{lo.lineList.length})
        </Text>
        {lo.orderedSelection.length === 0 ? (
          <Text style={x.answerPreview}>No lines selected yet.</Text>
        ) : (
          lo.orderedSelection.map((line, idx) => (
            <Pressable key={`${line}-${idx}`} style={x.selectedLine} onPress={() => lo.removeLine(idx, line)}>
              <Text style={x.lineText}>{line}</Text>
              <Text style={x.removeIcon}>×</Text>
            </Pressable>
          ))
        )}
      </View>
      <Text style={x.answerZoneTitle}>Line Pool</Text>
      {lo.poolLines.map((line, idx) => (
        <Pressable key={`${line}-${idx}`} style={x.poolOption} onPress={() => lo.addLine(line, idx)}>
          <Text style={v.optionLabel}>{line}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[x.secondaryAction, lo.orderedSelection.length === 0 && v.disabled]}
        disabled={lo.orderedSelection.length === 0}
        onPress={lo.resetOrder}
      >
        <Text style={x.secondaryActionLabel}>Reset</Text>
      </Pressable>
      <Pressable style={[v.lessonButton, !canCheck && v.disabled]} disabled={!canCheck} onPress={() => void runCheck()}>
        <Text style={v.lessonButtonLabel}>Check</Text>
      </Pressable>
      {hasChecked && isAnswerCorrect ? (
        <>
          <Text style={[v.feedback, v.feedbackGood]}>Perfect order.</Text>
          {serverResult?.explanation ? <Text style={v.feedback}>{serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : hasChecked ? (
        <Text style={[v.feedback, v.feedbackBad]}>Order is incorrect. Reset and try again.</Text>
      ) : null}
    </View>
  );
}
