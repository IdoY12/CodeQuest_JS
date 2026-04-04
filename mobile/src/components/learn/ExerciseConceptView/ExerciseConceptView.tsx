import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { submitCurriculumExerciseAnswer } from "@/utils/submitCurriculumExerciseAnswer";
import { exerciseConceptStyles } from "./ExerciseConceptView.styles";

const CONCEPT_CARD_ANSWER_SENTINEL = "concept-card";

type Props = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseConceptView({ exercise, lessonSource, accessToken, onLessonExerciseComplete }: Props) {
  const [busy, setBusy] = useState(false);

  const submitPersonalized = () => {
    onLessonExerciseComplete(CONCEPT_CARD_ANSWER_SENTINEL, {
      source: "personalized",
      isCorrect: true,
      xpReward: exercise.xpReward,
    });
  };

  const submitCurriculum = async () => {
    if (!accessToken) return;
    setBusy(true);
    try {
      const result = await submitCurriculumExerciseAnswer(accessToken, exercise, CONCEPT_CARD_ANSWER_SENTINEL);
      onLessonExerciseComplete(CONCEPT_CARD_ANSWER_SENTINEL, { source: "curriculum", submitResult: result });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={exerciseConceptStyles.exerciseCard}>
      <Text style={exerciseConceptStyles.explanation}>{exercise.explanation ?? ""}</Text>
      <Pressable
        style={[exerciseConceptStyles.lessonButton, busy ? { opacity: 0.6 } : null]}
        disabled={busy || (lessonSource === "curriculum" && !accessToken)}
        onPress={() => (lessonSource === "personalized" ? submitPersonalized() : void submitCurriculum())}
      >
        <Text style={exerciseConceptStyles.lessonButtonLabel}>Got it</Text>
      </Pressable>
    </View>
  );
}
