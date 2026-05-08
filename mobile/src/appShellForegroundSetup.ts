import NetInfo from "@react-native-community/netinfo";
import * as Notifications from "expo-notifications";
import { ensureAppShellNotificationSetup, registerGlobalErrorHandlers, registerUnhandledRejectionLogger } from "@/utils/appShellPersistence";
import { logApp } from "@/utils/logger";

export function attachAppShellForegroundInfrastructure(setIsConnected: (next: boolean) => void): () => void {
  logApp("launch");
  registerGlobalErrorHandlers();
  void ensureAppShellNotificationSetup();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  const unsubscribeNetInfo = NetInfo.addEventListener((state) => setIsConnected(Boolean(state.isConnected)));
  const unsubscribeUnhandledRejectionLogger = registerUnhandledRejectionLogger();
  return () => {
    unsubscribeNetInfo();
    unsubscribeUnhandledRejectionLogger();
  };
}
