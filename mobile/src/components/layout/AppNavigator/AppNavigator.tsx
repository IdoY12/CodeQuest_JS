import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { OnboardingFlow } from "@/components/auth/onboarding-flow/OnboardingFlow";
import { ONBOARDING_SEEN_STORAGE_KEY } from "@/constants/onboardingStorageConstants";
import { logNav } from "@/utils/logger";
import { useAppSelector } from "@/redux/hooks";
import { HydrationLoadingScreen } from "@/components/layout/HydrationLoadingScreen/HydrationLoadingScreen";
import { MainNavigator } from "@/components/layout/MainNavigator/MainNavigator";
import { colors } from "@/theme/theme";

/**
 * Root navigation: wait for Redux hydration and auth bootstrap, then show the first-launch
 * onboarding wizard once per device (AsyncStorage), otherwise the primary app shell.
 */
export function AppNavigator() {
  const hasHydrated = useAppSelector((s) => s.session.hasHydrated);
  const authChecked = useAppSelector((s) => s.session.authChecked);
  /** `null` while reading AsyncStorage; then whether the wizard has completed on this device. */
  const [onboardingSeenOnDevice, setOnboardingSeenOnDevice] = React.useState<boolean | null>(null);
  const routeNameRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    void AsyncStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY).then((value) => setOnboardingSeenOnDevice(value === "1"));
  }, []);

  React.useEffect(() => {
    if (!hasHydrated || !authChecked) return;
    if (onboardingSeenOnDevice === null) return;
    logNav("root:route-selected", { route: onboardingSeenOnDevice ? "MainStack" : "Onboarding" });
  }, [hasHydrated, authChecked, onboardingSeenOnDevice]);

  if (!hasHydrated || !authChecked) {
    return <HydrationLoadingScreen />;
  }

  if (onboardingSeenOnDevice === null) {
    return <HydrationLoadingScreen />;
  }

  if (!onboardingSeenOnDevice) {
    return <OnboardingFlow onPersistedToDevice={() => setOnboardingSeenOnDevice(true)} />;
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
