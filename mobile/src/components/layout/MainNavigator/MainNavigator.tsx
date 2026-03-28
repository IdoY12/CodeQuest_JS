import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { HomeScreen } from "@/components/home/HomeScreen/HomeScreen";
import { DailyPuzzleScreen } from "@/components/daily-puzzle/DailyPuzzleScreen/DailyPuzzleScreen";
import { LearnNavigator } from "@/components/layout/LearnNavigator/LearnNavigator";
import { DuelNavigator } from "@/components/layout/DuelNavigator/DuelNavigator";
import { ProfileScreen } from "@/components/profile/ProfileScreen/ProfileScreen";
import { AuthScreen } from "@/components/auth/auth-screen/AuthScreen";
import { colors } from "@/theme/theme";
import type { HomeStackParamList } from "@/types/homeNavigation.types";
import type { MainTabParamList } from "@/types/mainTab.types";

const Tabs = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const RootStack = createNativeStackNavigator();

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
      <HomeStack.Screen name="DailyPuzzle" component={DailyPuzzleScreen} options={{ title: "Daily Puzzle" }} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
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
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <TabIcon label="👤" />, tabBarLabel: "Profile" }}
      />
    </Tabs.Navigator>
  );
}

/** Main app stack: tab shell plus modal auth screen. */
export function MainNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          presentation: "modal",
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          title: "Sign in",
        }}
      />
    </RootStack.Navigator>
  );
}
