import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useExerciseDragDropLesson } from "@/hooks/useExerciseDragDropLesson";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { v } from "./ExerciseView.styles";
import { x } from "./ExerciseView.styles.extra";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvDragDrop({ exercise, accessToken, onLessonExerciseComplete }: Base) {
  const { drag: d, canCheck, runCheck, goNext, showResults, isCorrectNow, serverResult } = useExerciseDragDropLesson(
    exercise,
    accessToken,
    onLessonExerciseComplete,
  );

  return (
    <View style={v.exerciseCard}>
      <Text style={v.explanation}>Build the answer above. Tap a selected line to remove it.</Text>
      <View style={x.answerZone}>
        <Text style={x.answerZoneTitle}>
          Answer Zone ({d.orderedSelection.length}/{d.lineList.length})
        </Text>
        {d.orderedSelection.length === 0 ? (
          <Text style={x.answerPreview}>No lines selected yet.</Text>
        ) : (
          d.orderedSelection.map((line, idx) => (
            <Pressable key={`${line}-${idx}`} style={x.selectedLine} onPress={() => d.removeLine(idx, line)}>
              <Text style={x.lineText}>{line}</Text>
              <Text style={x.removeIcon}>×</Text>
            </Pressable>
          ))
        )}
      </View>
      <Text style={x.answerZoneTitle}>Line Pool</Text>
      {d.poolLines.map((line, idx) => (
        <Pressable key={`${line}-${idx}`} style={x.poolOption} onPress={() => d.addLine(line, idx)}>
          <Text style={v.optionLabel}>{line}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[x.secondaryAction, d.orderedSelection.length === 0 && v.disabled]}
        disabled={d.orderedSelection.length === 0}
        onPress={d.resetOrder}
      >
        <Text style={x.secondaryActionLabel}>Reset</Text>
      </Pressable>
      <Pressable style={[v.lessonButton, !canCheck && v.disabled]} disabled={!canCheck} onPress={() => void runCheck()}>
        <Text style={v.lessonButtonLabel}>Check</Text>
      </Pressable>
      {showResults && isCorrectNow ? (
        <>
          <Text style={[v.feedback, v.feedbackGood]}>Perfect order.</Text>
          {serverResult?.explanation ? <Text style={v.feedback}>{serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : showResults ? (
        <Text style={[v.feedback, v.feedbackBad]}>Order is incorrect. Reset and try again.</Text>
      ) : null}
    </View>
  );
}
