import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { HomeScreen } from "@/components/home/HomeScreen/HomeScreen";
import { CodePuzzleScreen } from "@/components/code-puzzle/CodePuzzleScreen/CodePuzzleScreen";
import { LearnNavigator } from "@/components/layout/LearnNavigator/LearnNavigator";
import { DuelNavigator } from "@/components/layout/DuelNavigator/DuelNavigator";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { colors } from "@/theme/theme";
import type { HomeStackParamList } from "@/types/homeNavigation.types";
import type { MainTabParamList } from "@/types/mainTab.types";
import { guardDuelAccess } from "@/utils/formatHelpers";

const Tabs = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const TabIcon = React.memo(function TabIcon({ label }: { label: string }) {
  return (
    <View>
      <Text>{label}</Text>
    </View>
  );
});

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false, title: "Home" }} />
      <HomeStack.Screen name="CodePuzzle" component={CodePuzzleScreen} options={{ title: "Code Puzzle" }} />
    </HomeStack.Navigator>
  );
}

export function MainTabs() {
  const isGuest = useAppSelector((s) => s.session.isGuest);

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeNavigator}
        options={{ tabBarIcon: () => <TabIcon label="🏠" />, tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="LearnTab"
        component={LearnNavigator}
        options={{ tabBarIcon: () => <TabIcon label="📚" />, tabBarLabel: "Learn" }}
      />
      <Tabs.Screen
        name="DuelTab"
        component={DuelNavigator}
        options={{ tabBarIcon: () => <TabIcon label="⚔️" />, tabBarLabel: "Duel" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            guardDuelAccess(
              isGuest,
              () => navigation.getParent()?.navigate("Auth" as never),
              () => {},
            );
            if (isGuest) e.preventDefault();
          },
        })}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <TabIcon label="👤" />, tabBarLabel: "Profile" }}
      />
    </Tabs.Navigator>
  );
}
