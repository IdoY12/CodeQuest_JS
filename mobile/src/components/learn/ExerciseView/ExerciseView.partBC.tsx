import React from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { useExerciseFindBug } from "@/hooks/useExerciseFindBug";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { v } from "./ExerciseView.styles";
import { x } from "./ExerciseView.styles.extra";

type Base = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function EvFindBug({ exercise, lineList, accessToken, onLessonExerciseComplete }: Base & { lineList: string[] }) {
  const u = useExerciseFindBug(exercise, accessToken, onLessonExerciseComplete);
  return (
    <View style={v.exerciseCard}>
      {lineList.map((line, idx) => (
        <Pressable
          key={`${line}-${idx}`}
          onPress={() => u.setSelected(String(idx + 1))}
          style={[x.line, u.selected === String(idx + 1) && x.lineSelected]}
        >
          <Text style={x.lineText}>
            {idx + 1}. {line}
          </Text>
        </Pressable>
      ))}
      <Pressable style={[v.lessonButton, !u.canCheck && v.disabled]} disabled={!u.canCheck} onPress={() => void u.runCheck()}>
        <Text style={v.lessonButtonLabel}>Check Line</Text>
      </Pressable>
      {u.showResults ? (
        <>
          <Text style={[v.feedback, u.isCorrectNow ? v.feedbackGood : v.feedbackBad]}>
            {u.isCorrectNow ? "Great catch." : "Bug revealed. Review explanation and continue."}
          </Text>
          {u.isCorrectNow && u.serverResult?.explanation ? <Text style={v.feedback}>{u.serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={u.goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
