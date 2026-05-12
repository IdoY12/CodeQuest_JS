import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDuelSocketBootstrap } from "@/hooks/useDuelSocket";
import { colors } from "@/theme/theme";
import type { DuelStackParamList } from "@/types/duelNavigation.types";
import { DuelActiveDuelScreen } from "./DuelActiveDuelScreen";
import { DuelHomeScreen } from "./DuelHomeScreen";
import { DuelMatchmakingScreen } from "./DuelMatchmakingScreen";
import { DuelResultsScreen } from "./DuelResultsScreen";

const Stack = createNativeStackNavigator<DuelStackParamList>();

const STACK_OPTIONS = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  contentStyle: { backgroundColor: colors.background },
};
const HOME_OPTS = { title: "Duel" };
const MATCHMAKING_OPTS = { title: "Matchmaking" };
const ACTIVE_DUEL_OPTS = { title: "Live Duel" };
const RESULTS_OPTS = { title: "Results" };

export function DuelNavigator() {
  useDuelSocketBootstrap();
  return (
    <Stack.Navigator screenOptions={STACK_OPTIONS}>
      <Stack.Screen name="DuelHome" component={DuelHomeScreen} options={HOME_OPTS} />
      <Stack.Screen name="Matchmaking" component={DuelMatchmakingScreen} options={MATCHMAKING_OPTS} />
      <Stack.Screen name="ActiveDuel" component={DuelActiveDuelScreen} options={ACTIVE_DUEL_OPTS} />
      <Stack.Screen name="DuelResults" component={DuelResultsScreen} options={RESULTS_OPTS} />
    </Stack.Navigator>
  );
}
