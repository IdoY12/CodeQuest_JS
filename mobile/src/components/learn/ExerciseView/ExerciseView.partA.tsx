import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import LearningService from "@/services/LearningService";
import { evaluateExerciseLocally } from "@/utils/lessonExerciseState";
import { v } from "./ExerciseView.styles";

const CONCEPT_SENTINEL = "concept-card";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvConcept({ exercise, accessToken, onLessonExerciseComplete }: Base) {
  const learning = useAuthenticatedService(LearningService);
  const [busy, setBusy] = useState(false);
  const submitCurriculum = async () => {
    setBusy(true);
    try {
      const result =
        accessToken && learning
          ? await learning.submitExercise(exercise.id, CONCEPT_SENTINEL)
          : evaluateExerciseLocally(exercise, CONCEPT_SENTINEL);
      onLessonExerciseComplete(CONCEPT_SENTINEL, { source: "curriculum", submitResult: result });
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={v.exerciseCard}>
      <Text style={v.explanation}>{exercise.explanation ?? ""}</Text>
      <Pressable style={[v.lessonButton, busy ? { opacity: 0.6 } : null]} disabled={busy} onPress={() => void submitCurriculum()}>
        <Text style={v.lessonButtonLabel}>Got it</Text>
      </Pressable>
    </View>
  );
}
