import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import type { LessonScreenProps } from "@/types/learnNavigation.types";
import { progressWidthStyle } from "@/utils/progressWidthStyle";
import { useLessonScreenController } from "@/hooks/useLessonScreenController";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { CodeSnippet } from "@/components/common/CodeSnippet/CodeSnippet";
import { ExerciseRenderer } from "@/components/learn/ExerciseRenderer/ExerciseRenderer";
import { lessonScreenStyles } from "./LessonScreen.styles";

export function LessonScreen({ navigation, route }: LessonScreenProps) {
  const c = useLessonScreenController(navigation, route);
  if (c.loading || !c.exercise) {
    return (
      <SafeAreaView style={lessonScreenStyles.container} edges={["top", "bottom"]}>
        <View style={lessonScreenStyles.content}>
          <Text style={lessonScreenStyles.title}>Loading lesson...</Text>
          <ActivityIndicator color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }
  const onLessonExerciseComplete = (answer: string, context: LessonExerciseCompletionContext) =>
    void c.onLessonExerciseComplete(answer, context);
  return (
    <SafeAreaView style={lessonScreenStyles.container} edges={["top", "bottom"]}>
      <ScrollView style={lessonScreenStyles.container} contentContainerStyle={lessonScreenStyles.content}>
        <Text style={lessonScreenStyles.chapterDesc}>{c.lessonTitle}</Text>
        <View style={lessonScreenStyles.progressTrack}>
          <View style={[lessonScreenStyles.progressFill, progressWidthStyle(c.progress)]} />
        </View>
        <Text style={lessonScreenStyles.progressText}>
          {c.exerciseIndex + 1}/{c.exercises.length}
        </Text>
        <Text style={lessonScreenStyles.prompt}>{c.exercise.prompt}</Text>
        <CodeSnippet code={c.exercise.codeSnippet} />
        <ExerciseRenderer
          exercise={c.exercise}
          lessonSource={c.lessonSource}
          accessToken={c.accessToken}
          onLessonExerciseComplete={onLessonExerciseComplete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
