import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import type { LessonScreenProps } from "@/types/learnNavigation.types";
import { progressWidthStyle } from "@/utils/formatHelpers";
import { useLessonLoad } from "@/hooks/useLessonLoad";
import { useAppSelector } from "@/redux/hooks";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { useLessonExerciseCompleteHandler } from "@/hooks/useLessonExerciseCompleteHandler";
import { CodeSnippet } from "@/components/common/CodeSnippet/CodeSnippet";
import { ExerciseView } from "@/components/learn/ExerciseView/ExerciseView";
import { lessonScreenStyles } from "./LessonScreen.styles";

export function LessonScreen({ navigation, route }: LessonScreenProps) {
  const lessonId = route.params.lessonId;
  const lessonTitle = route.params.lessonTitle;
  const personalizedLevel = route.params.personalizedLevel;
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const lessonSource: "personalized" | "curriculum" = personalizedLevel ? "personalized" : "curriculum";
  const load = useLessonLoad(lessonId, personalizedLevel, accessToken);
  const exercise = load.exercises[load.exerciseIndex];
  const onLessonExerciseComplete = useLessonExerciseCompleteHandler(navigation, personalizedLevel, lessonId, lessonTitle, load);
  const progress = load.exercises.length > 0 ? ((load.exerciseIndex + 1) / load.exercises.length) * 100 : 0;
  if (load.loading || !exercise) {
    return (
      <SafeAreaView style={lessonScreenStyles.container} edges={["top", "bottom"]}>
        <View style={lessonScreenStyles.content}>
          <Text style={lessonScreenStyles.title}>Loading lesson...</Text>
          <ActivityIndicator color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }
  const complete = (answer: string, context: LessonExerciseCompletionContext) =>
    void onLessonExerciseComplete(answer, context);
  return (
    <SafeAreaView style={lessonScreenStyles.container} edges={["top", "bottom"]}>
      <ScrollView style={lessonScreenStyles.container} contentContainerStyle={lessonScreenStyles.content}>
        <Text style={lessonScreenStyles.chapterDesc}>{lessonTitle}</Text>
        <View style={lessonScreenStyles.progressTrack}>
          <View style={[lessonScreenStyles.progressFill, progressWidthStyle(progress)]} />
        </View>
        <Text style={lessonScreenStyles.progressText}>
          {load.exerciseIndex + 1}/{load.exercises.length}
        </Text>
        <Text style={lessonScreenStyles.prompt}>{exercise.prompt}</Text>
        <CodeSnippet code={exercise.codeSnippet} />
        <ExerciseView
          exercise={exercise}
          lessonSource={lessonSource}
          accessToken={accessToken}
          onLessonExerciseComplete={complete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
