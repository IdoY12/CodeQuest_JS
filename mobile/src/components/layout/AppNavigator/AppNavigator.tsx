import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { OnboardingFlow } from "@/components/auth/onboarding-flow/OnboardingFlow";
import { logNav } from "@/utils/logger";
import { useAppSelector } from "@/redux/hooks";
import { HydrationLoadingScreen } from "@/components/layout/HydrationLoadingScreen/HydrationLoadingScreen";
import { MainNavigator } from "@/components/layout/MainNavigator/MainNavigator";
import { colors } from "@/theme/theme";

/** Root navigation: hydration gate, onboarding, then primary app container. */
export function AppNavigator() {
  const hasHydrated = useAppSelector((s) => s.session.hasHydrated);
  const authChecked = useAppSelector((s) => s.session.authChecked);
  const isAuthenticated = useAppSelector((s) => s.session.isAuthenticated);
  const hasCompletedOnboarding = useAppSelector((s) => s.session.hasCompletedOnboarding);
  const routeNameRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!hasHydrated) return;
    const route = !hasCompletedOnboarding ? "Onboarding" : "MainStack";
    logNav("root:route-selected", { route });
  }, [hasCompletedOnboarding, hasHydrated]);

  if (!hasHydrated || !authChecked) {
    return <HydrationLoadingScreen />;
  }

  if (!hasCompletedOnboarding) {
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
