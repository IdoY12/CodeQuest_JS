import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { OnboardingFlow } from "@/components/auth/onboarding-flow/OnboardingFlow";
import { logNav } from "@/utils/logger";
import { useAppSelector } from "@/redux/hooks";
import { HydrationLoadingScreen } from "@/components/layout/HydrationLoadingScreen/HydrationLoadingScreen";
import { MainNavigator } from "@/components/layout/MainNavigator/MainNavigator";
import { colors } from "@/theme/theme";

/** Root navigation: hydration gate, onboarding, then primary app container. */
export function AppNavigator() {
  const onboardingSeenKey = "onboarding_seen_v1";
  const hasHydrated = useAppSelector((s) => s.session.hasHydrated);
  const authChecked = useAppSelector((s) => s.session.authChecked);
  const hasCompletedOnboarding = useAppSelector((s) => s.session.hasCompletedOnboarding);
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState<boolean | null>(null);
  const routeNameRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    void AsyncStorage.getItem(onboardingSeenKey).then((value) => setHasSeenOnboarding(value === "1"));
  }, []);

  React.useEffect(() => {
    if (!hasCompletedOnboarding || hasSeenOnboarding !== false) return;
    void AsyncStorage.setItem(onboardingSeenKey, "1").then(() => setHasSeenOnboarding(true));
  }, [hasCompletedOnboarding, hasSeenOnboarding]);

  React.useEffect(() => {
    if (!hasHydrated || hasSeenOnboarding === null) return;
    const route = !hasSeenOnboarding ? "Onboarding" : "MainStack";
    logNav("root:route-selected", { route });
  }, [hasHydrated, hasSeenOnboarding]);

  if (!hasHydrated || !authChecked || hasSeenOnboarding === null) {
    return <HydrationLoadingScreen />;
  }

  if (!hasSeenOnboarding) {
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
