import React from "react";
import { Pressable, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDuelSocketBootstrap } from "@/hooks/useDuelSocket";
import { duelResetMatch } from "@/utils/duelSocketCommands";
import { colors } from "@/theme/theme";
import type { DuelStackParamList } from "@/types/duelNavigation.types";
import { DuelActiveDuelScreen } from "./DuelActiveDuelScreen";
import { DuelHomeScreen } from "./DuelHomeScreen";
import { DuelMatchmakingScreen } from "./DuelMatchmakingScreen";
import { DuelResultsScreen } from "./DuelResultsScreen";
import { styles } from "./DuelNavigator.styles";

const Stack = createNativeStackNavigator<DuelStackParamList>();

export function DuelNavigator() {
  useDuelSocketBootstrap();
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
      <Stack.Screen
        name="DuelResults"
        component={DuelResultsScreen}
        options={({ navigation }) => ({
          title: "Results",
          headerLeft: () => (
            <Pressable style={styles.navBack} onPress={() => { duelResetMatch(); navigation.popToTop(); }}>
              <Text style={styles.navBackLabel}>Duel</Text>
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
