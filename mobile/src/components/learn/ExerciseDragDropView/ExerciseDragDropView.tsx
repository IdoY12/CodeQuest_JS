import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { useExerciseDragDrop } from "@/hooks/useExerciseDragDrop";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { submitCurriculumExerciseAnswer } from "@/utils/submitCurriculumExerciseAnswer";
import { exerciseDragDropStyles } from "./ExerciseDragDropView.styles";

type Props = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseDragDropView({ exercise, lessonSource, accessToken, onLessonExerciseComplete }: Props) {
  const dragDrop = useExerciseDragDrop(exercise.id, exercise.codeSnippet);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setServerResult(null);
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
  }, [exercise.id]);

  const canCheckPersonalized =
    dragDrop.orderedSelection.length === dragDrop.lineList.length && !dragDrop.hasChecked;
  const canCheckCurriculum =
    dragDrop.orderedSelection.length === dragDrop.lineList.length && !curriculumChecked;
  const canCheck = lessonSource === "personalized" ? canCheckPersonalized : canCheckCurriculum;

  const runCheck = async () => {
    if (lessonSource === "personalized") {
      dragDrop.runCheck(exercise.correctAnswer ?? "");
      return;
    }
    if (!accessToken) return;
    const result = await submitCurriculumExerciseAnswer(accessToken, exercise, dragDrop.normalizedAnswer);
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };

  const goNext = () => {
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(dragDrop.normalizedAnswer, {
        source: "personalized",
        isCorrect: Boolean(dragDrop.isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(dragDrop.normalizedAnswer, { source: "curriculum", submitResult: serverResult });
  };

  const showResults = lessonSource === "personalized" ? dragDrop.hasChecked : curriculumChecked;
  const isCorrectNow = lessonSource === "personalized" ? dragDrop.isCorrect : curriculumCorrect;

  return (
    <View style={exerciseDragDropStyles.exerciseCard}>
      <Text style={exerciseDragDropStyles.explanation}>
        Build the answer above. Tap a selected line to remove it.
      </Text>
      <View style={exerciseDragDropStyles.answerZone}>
        <Text style={exerciseDragDropStyles.answerZoneTitle}>
          Answer Zone ({dragDrop.orderedSelection.length}/{dragDrop.lineList.length})
        </Text>
        {dragDrop.orderedSelection.length === 0 ? (
          <Text style={exerciseDragDropStyles.answerPreview}>No lines selected yet.</Text>
        ) : (
          dragDrop.orderedSelection.map((line, idx) => (
            <Pressable
              key={`${line}-${idx}`}
              style={exerciseDragDropStyles.selectedLine}
              onPress={() => dragDrop.removeLine(idx, line)}
            >
              <Text style={exerciseDragDropStyles.lineText}>{line}</Text>
              <Text style={exerciseDragDropStyles.removeIcon}>×</Text>
            </Pressable>
          ))
        )}
      </View>
      <Text style={exerciseDragDropStyles.answerZoneTitle}>Line Pool</Text>
      {dragDrop.poolLines.map((line, idx) => (
        <Pressable key={`${line}-${idx}`} style={exerciseDragDropStyles.option} onPress={() => dragDrop.addLine(line, idx)}>
          <Text style={exerciseDragDropStyles.optionLabel}>{line}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseDragDropStyles.secondaryAction, dragDrop.orderedSelection.length === 0 && exerciseDragDropStyles.disabled]}
        disabled={dragDrop.orderedSelection.length === 0}
        onPress={dragDrop.resetOrder}
      >
        <Text style={exerciseDragDropStyles.secondaryActionLabel}>Reset</Text>
      </Pressable>
      <Pressable
        style={[exerciseDragDropStyles.lessonButton, !canCheck && exerciseDragDropStyles.disabled]}
        disabled={!canCheck}
        onPress={() => void runCheck()}
      >
        <Text style={exerciseDragDropStyles.lessonButtonLabel}>Check</Text>
      </Pressable>
      {showResults ? (
        <>
          <Text
            style={[
              exerciseDragDropStyles.feedback,
              isCorrectNow ? exerciseDragDropStyles.feedbackGood : exerciseDragDropStyles.feedbackBad,
            ]}
          >
            {isCorrectNow ? "Perfect order." : "Order is incorrect. Reset and try again, or continue."}
          </Text>
          {isCorrectNow && serverResult?.explanation ? (
            <Text style={exerciseDragDropStyles.feedback}>{serverResult.explanation}</Text>
          ) : null}
          <Pressable style={exerciseDragDropStyles.lessonButton} onPress={goNext}>
            <Text style={exerciseDragDropStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
