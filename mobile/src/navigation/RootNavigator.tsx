import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { useAppStore } from "../stores/useAppStore";
import { OnboardingFlow } from "../features/onboarding/OnboardingFlow";
import { AuthScreen } from "../features/auth/AuthScreen";
import { HomeScreen } from "../features/home/HomeScreen";
import { LearnNavigator } from "../features/learn/LearnNavigator";
import { DuelNavigator } from "../features/duel/DuelNavigator";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { colors } from "../theme/theme";

const Tabs = createBottomTabNavigator();

export function RootNavigator() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.accent,
        },
      }}
    >
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
          component={HomeScreen}
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
    </NavigationContainer>
  );
}

function TabIcon({ label }: { label: string }) {
  return (
    <View>
      <Text>{label}</Text>
    </View>
  );
}
