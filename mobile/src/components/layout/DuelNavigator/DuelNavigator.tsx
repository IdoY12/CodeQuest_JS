import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme/theme";
import type { DuelStackParamList } from "@/types/duelNavigation.types";
import { DuelActiveDuelScreen } from "./DuelActiveDuelScreen";
import { DuelHomeScreen } from "./DuelHomeScreen";
import { DuelMatchmakingScreen } from "./DuelMatchmakingScreen";
import { DuelResultsScreen } from "./DuelResultsScreen";

const Stack = createNativeStackNavigator<DuelStackParamList>();

export function DuelNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="DuelHome" component={DuelHomeScreen} options={{ title: "Duel" }} />
      <Stack.Screen name="Matchmaking" component={DuelMatchmakingScreen} options={{ title: "Matchmaking" }} />
      <Stack.Screen name="ActiveDuel" component={DuelActiveDuelScreen} options={{ title: "Live Duel" }} />
      <Stack.Screen name="DuelResults" component={DuelResultsScreen} options={{ title: "Results" }} />
    </Stack.Navigator>
  );
}
