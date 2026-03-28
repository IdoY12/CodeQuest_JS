import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme/theme";
import type { LearnStackParamList } from "@/types/learnNavigation.types";
import { LearnRoadmapScreen } from "@/screens/LearnRoadmap/LearnRoadmapScreen/LearnRoadmapScreen";
import { LessonResultsScreen } from "@/screens/LessonResults/LessonResultsScreen/LessonResultsScreen";
import { LessonScreen } from "@/screens/Lesson/LessonScreen/LessonScreen";
import { learnNavigatorStyles } from "./LearnNavigator.styles";

const Stack = createNativeStackNavigator<LearnStackParamList>();

export function LearnNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: learnNavigatorStyles.header,
        headerTintColor: colors.textPrimary,
        contentStyle: learnNavigatorStyles.scene,
      }}
    >
      <Stack.Screen name="LearnRoadmap" component={LearnRoadmapScreen} options={{ title: "Learn" }} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="LessonResults" component={LessonResultsScreen} options={{ title: "Results" }} />
    </Stack.Navigator>
  );
}
