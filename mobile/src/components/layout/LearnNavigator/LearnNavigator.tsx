import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme/theme";
import type { LearnStackParamList } from "@/types/learnNavigation.types";
import { LearnRoadmapScreen } from "@/components/learn/LearnRoadmapScreen/LearnRoadmapScreen";
import { LessonResultsScreen } from "@/components/learn/LessonResultsScreen/LessonResultsScreen";
import { LessonScreen } from "@/components/learn/LessonScreen/LessonScreen";
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
