import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { incrementLessonsCompleted } from "@/redux/duel-slice";
import { logNav } from "@/services/logger";
import type { LessonResultsNavigation } from "@/types/learnNavigation.types";
import { lessonResultsStyles } from "./LessonResultsScreen.styles";

type RouteParams = { accuracy?: number; lessonTitle?: string };

type Props = {
  navigation: LessonResultsNavigation;
  route: { params?: RouteParams };
};

export function LessonResultsScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatcher();
  const accuracy = route.params?.accuracy ?? 0;
  const lessonTitle = route.params?.lessonTitle ?? "Lesson";
  const level = useAppSelector((s) => s.xp.level);
  const xp = useAppSelector((s) => s.xp.xpTotal);
  useEffect(() => {
    logNav("screen:enter", { screen: "LessonResultsScreen" });
    dispatch(incrementLessonsCompleted());
    return () => logNav("screen:leave", { screen: "LessonResultsScreen" });
  }, [dispatch]);
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
