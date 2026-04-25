import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/theme";
import type Exercise from "@/models/Exercise";
import { CODE_FILL_DEFAULT_TOKENS } from "@/constants/codeFillDefaults";
import { useBuiltAnswerLessonExercise } from "@/hooks/useBuiltAnswerLessonExercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { v } from "./ExerciseView.styles";
import { x } from "./ExerciseView.styles.extra";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvCodeFill({ exercise, accessToken, onLessonExerciseComplete }: Base) {
  const u = useBuiltAnswerLessonExercise(exercise, accessToken, onLessonExerciseComplete);
  const tokens = exercise.options.length > 0 ? exercise.options.map((o) => o.text) : [...CODE_FILL_DEFAULT_TOKENS];

  return (
    <View style={v.exerciseCard}>
      <TextInput
        style={x.input}
        value={u.input}
        onChangeText={u.setInput}
        placeholder="Type answer"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
      />
      <View style={x.suggestionRow}>
        {tokens.map((token) => (
          <Pressable key={token} style={x.token} onPress={() => u.setInput((p) => `${p}${token}`)}>
            <Text style={x.tokenText}>{token}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={[v.lessonButton, !u.canCheck && v.disabled]} disabled={!u.canCheck} onPress={() => void u.runCheck()}>
        <Text style={v.lessonButtonLabel}>Submit</Text>
      </Pressable>
      {u.hasChecked && u.isAnswerCorrect ? (
        <>
          <Text style={[v.feedback, v.feedbackGood]}>Nice work.</Text>
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
