import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "@/components/auth/auth-screen/AuthScreen";
import { colors } from "@/theme/theme";
import { MainTabs } from "./MainNavigatorTabs";

const RootStack = createNativeStackNavigator();

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
