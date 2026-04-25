import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useBuiltAnswerLessonExercise } from "@/hooks/useBuiltAnswerLessonExercise";
import { v } from "./ExerciseView.styles";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvConcept({ exercise, accessToken, onLessonExerciseComplete }: Base) {
  const { busy, submitConcept } = useBuiltAnswerLessonExercise(exercise, accessToken, onLessonExerciseComplete);

  return (
    <View style={v.exerciseCard}>
      <Text style={v.explanation}>{exercise.explanation ?? ""}</Text>
      <Pressable style={[v.lessonButton, busy ? { opacity: 0.6 } : null]} disabled={busy} onPress={() => void submitConcept()}>
        <Text style={v.lessonButtonLabel}>Got it</Text>
      </Pressable>
    </View>
  );
}
