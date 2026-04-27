import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useBuiltAnswerLessonExercise } from "@/hooks/useBuiltAnswerLessonExercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { exerciseViewStyles } from "./ExerciseView.styles";

type ExerciseLineOrderingProps = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseLineOrdering({ exercise, accessToken, onLessonExerciseComplete }: ExerciseLineOrderingProps) {
  const {
    lineOrder: lineOrderInteraction,
    canCheck,
    runCheck,
    goNext,
    hasChecked,
    isAnswerCorrect,
    serverResult,
  } = useBuiltAnswerLessonExercise(exercise, accessToken, onLessonExerciseComplete);

  return (
    <View style={exerciseViewStyles.exerciseCard}>
      <Text style={exerciseViewStyles.explanation}>Build the answer above. Tap a selected line to remove it.</Text>
      <View style={exerciseViewStyles.lineOrderingAnswerZone}>
        <Text style={exerciseViewStyles.lineOrderingSectionTitle}>
          Answer Zone ({lineOrderInteraction.orderedSelection.length}/{lineOrderInteraction.lineList.length})
        </Text>
        {lineOrderInteraction.orderedSelection.length === 0 ? (
          <Text style={exerciseViewStyles.lineOrderingEmptyHint}>No lines selected yet.</Text>
        ) : (
          lineOrderInteraction.orderedSelection.map((line, orderedIndex) => (
            <Pressable
              key={`${line}-${orderedIndex}`}
              style={exerciseViewStyles.lineOrderingSelectedRow}
              onPress={() => lineOrderInteraction.removeLine(orderedIndex, line)}
            >
              <Text style={exerciseViewStyles.monospaceLineText}>{line}</Text>
              <Text style={exerciseViewStyles.lineOrderingRemoveGlyph}>×</Text>
            </Pressable>
          ))
        )}
      </View>
      <Text style={exerciseViewStyles.lineOrderingSectionTitle}>Line Pool</Text>
      {lineOrderInteraction.poolLines.map((line, poolIndex) => (
        <Pressable key={`${line}-${poolIndex}`} style={exerciseViewStyles.lineOrderingPoolRow} onPress={() => lineOrderInteraction.addLine(line, poolIndex)}>
          <Text style={exerciseViewStyles.optionLabel}>{line}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseViewStyles.lineOrderingSecondaryButton, lineOrderInteraction.orderedSelection.length === 0 && exerciseViewStyles.disabled]}
        disabled={lineOrderInteraction.orderedSelection.length === 0}
        onPress={lineOrderInteraction.resetOrder}
      >
        <Text style={exerciseViewStyles.lineOrderingSecondaryButtonLabel}>Reset</Text>
      </Pressable>
      <Pressable style={[exerciseViewStyles.lessonButton, !canCheck && exerciseViewStyles.disabled]} disabled={!canCheck} onPress={() => void runCheck()}>
        <Text style={exerciseViewStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {hasChecked && isAnswerCorrect ? (
        <>
          <Text style={[exerciseViewStyles.feedback, exerciseViewStyles.feedbackGood]}>Perfect order.</Text>
          {serverResult?.explanation ? <Text style={exerciseViewStyles.feedback}>{serverResult.explanation}</Text> : null}
          <Pressable style={exerciseViewStyles.lessonButton} onPress={goNext}>
            <Text style={exerciseViewStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : hasChecked ? (
        <Text style={[exerciseViewStyles.feedback, exerciseViewStyles.feedbackBad]}>Order is incorrect. Reset and try again.</Text>
      ) : null}
    </View>
  );
}
