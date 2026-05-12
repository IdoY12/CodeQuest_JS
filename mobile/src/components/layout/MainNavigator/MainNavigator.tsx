import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "@/components/auth/auth-screen/AuthScreen";
import { colors } from "@/theme/theme";
import { MainTabs } from "./MainNavigatorTabs";

const RootStack = createNativeStackNavigator();

const ROOT_STACK_OPTIONS = { headerShown: false };
const AUTH_SCREEN_OPTIONS = {
  presentation: "modal" as const,
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  title: "Sign in",
};

export function MainNavigator() {
  return (
    <RootStack.Navigator screenOptions={ROOT_STACK_OPTIONS}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen name="Auth" component={AuthScreen} options={AUTH_SCREEN_OPTIONS} />
    </RootStack.Navigator>
  );
}
