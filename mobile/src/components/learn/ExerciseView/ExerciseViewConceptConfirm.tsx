import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useBuiltAnswerLessonExercise } from "@/hooks/useBuiltAnswerLessonExercise";
import { exerciseViewStyles } from "./ExerciseView.styles";

type ExerciseConceptConfirmProps = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseConceptConfirm({ exercise, accessToken, onLessonExerciseComplete }: ExerciseConceptConfirmProps) {
  const { busy, submitConcept } = useBuiltAnswerLessonExercise(exercise, accessToken, onLessonExerciseComplete);

  return (
    <View style={exerciseViewStyles.exerciseCard}>
      <Text style={exerciseViewStyles.explanation}>{exercise.explanation ?? ""}</Text>
      <Pressable
        style={[exerciseViewStyles.lessonButton, busy ? { opacity: 0.6 } : null]}
        disabled={busy}
        onPress={() => void submitConcept()}
      >
        <Text style={exerciseViewStyles.lessonButtonLabel}>Got it</Text>
      </Pressable>
    </View>
  );
}
