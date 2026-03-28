import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLessonResultsScreen } from "@/hooks/useLessonResultsScreen";
import type { LessonResultsNavigation } from "@/types/learnNavigation.types";
import { lessonResultsStyles } from "./LessonResultsScreen.styles";

type RouteParams = { accuracy?: number; lessonTitle?: string };

type Props = {
  navigation: LessonResultsNavigation;
  route: { params?: RouteParams };
};

export function LessonResultsScreen({ navigation, route }: Props) {
  const accuracy = route.params?.accuracy ?? 0;
  const lessonTitle = route.params?.lessonTitle ?? "Lesson";
  const { level, xp } = useLessonResultsScreen();
  const stars = accuracy > 90 ? 3 : accuracy > 70 ? 2 : 1;
  return (
    <SafeAreaView style={lessonResultsStyles.container} edges={["top", "bottom"]}>
      <View style={lessonResultsStyles.content}>
        <Text style={lessonResultsStyles.title}>Lesson Complete</Text>
        <Text style={lessonResultsStyles.resultText}>{lessonTitle}</Text>
        <Text style={lessonResultsStyles.resultText}>Accuracy: {accuracy}%</Text>
        <Text style={lessonResultsStyles.resultText}>Level: {level}</Text>
        <Text style={lessonResultsStyles.resultText}>Total XP: {xp}</Text>
        <Text style={lessonResultsStyles.starRow}>{"⭐".repeat(stars)}</Text>
        <Pressable style={lessonResultsStyles.lessonButton} onPress={() => navigation.navigate("LearnRoadmap")}>
          <Text style={lessonResultsStyles.lessonButtonLabel}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
