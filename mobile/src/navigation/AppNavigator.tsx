import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { OnboardingFlow } from "@/auth/screens/OnboardingFlow/OnboardingFlow";
import { logNav } from "@/services/logger";
import { useAppSelector } from "@/store/hooks";
import { selectAuthChecked, selectHasCompletedOnboarding, selectHasHydrated, selectIsAuthenticated } from "@/store/selectors";
import { HydrationLoadingScreen } from "@/navigation/GuardedRoute";
import { MainNavigator } from "@/navigation/MainNavigator";
import { colors } from "@/theme/theme";

/** Root navigation: hydration gate, onboarding, then primary app container. */
export function AppNavigator() {
  const hasHydrated = useAppSelector(selectHasHydrated);
  const authChecked = useAppSelector(selectAuthChecked);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hasCompletedOnboarding = useAppSelector(selectHasCompletedOnboarding);
  const routeNameRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!hasHydrated) return;
    const route = isAuthenticated && !hasCompletedOnboarding ? "Onboarding" : "MainStack";
    logNav("root:route-selected", { route });
  }, [hasCompletedOnboarding, hasHydrated, isAuthenticated]);

  if (!hasHydrated || !authChecked) {
    return <HydrationLoadingScreen />;
  }

  if (isAuthenticated && !hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <NavigationContainer
      onReady={() => {
        const currentRoute = routeNameRef.current;
        logNav("screen:enter", { screen: currentRoute ?? "Home" });
      }}
      onStateChange={(state) => {
        const route = state?.routes[state.index];
        const current = route?.name;
        const previous = routeNameRef.current;
        if (previous && previous !== current) {
          logNav("screen:leave", { screen: previous });
        }
        if (current && previous !== current) {
          logNav("screen:enter", { screen: current });
        }
        routeNameRef.current = current;
      }}
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
      <MainNavigator />
    </NavigationContainer>
  );
}
