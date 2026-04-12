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
      {lineList.map((line, idx) => {
        const lineNumber = String(idx + 1);
        const lineExtraStyle = (() => {
          if (u.lastCheckedAnswer === lineNumber && u.isCorrectNow) return v.correct;
          if (u.selected === lineNumber) return x.lineSelected;
          return null;
        })();
        return (
          <Pressable
            key={`${line}-${idx}`}
            onPress={() => u.setSelected(lineNumber)}
            style={lineExtraStyle ? [x.line, lineExtraStyle] : x.line}
          >
            <Text style={x.lineText}>
              {idx + 1}. {line}
            </Text>
          </Pressable>
        );
      })}
      <Pressable style={[v.lessonButton, !u.canCheck && v.disabled]} disabled={!u.canCheck} onPress={() => void u.runCheck()}>
        <Text style={v.lessonButtonLabel}>Check Line</Text>
      </Pressable>
      {u.showResults && u.isCorrectNow ? (
        <>
          <Text style={[v.feedback, v.feedbackGood]}>Great catch.</Text>
          {u.serverResult?.explanation ? <Text style={v.feedback}>{u.serverResult.explanation}</Text> : null}
          <Pressable style={v.lessonButton} onPress={u.goNext}>
            <Text style={v.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : u.showResults ? (
        <Text style={[v.feedback, v.feedbackBad]}>Not the right line. Try again.</Text>
      ) : null}
    </View>
  );
}
