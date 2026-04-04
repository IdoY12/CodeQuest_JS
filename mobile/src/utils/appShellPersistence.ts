import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import type store from "@/redux/store";
import type { AppDispatch } from "@/redux/store";
import type AuthService from "@/services/AuthService";
import { setUserIdentity } from "@/redux/profile-slice";
import { REDUX_PERSIST_KEY } from "@/utils/hydrateStore";
import { clearSecureSessionTokens, writeSecureSessionTokens } from "@/utils/secureSessionTokens";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";
import { logError } from "@/services/logger";

export function subscribeStoreToHybridStorage(appStore: typeof store): () => void {
  let previousSerialized = "";
  return appStore.subscribe(() => {
    const state = appStore.getState();
    const sessionForDisk = { ...state.session, accessToken: null as string | null, refreshToken: null as string | null };
    const serialized = JSON.stringify({
      session: sessionForDisk,
      profile: state.profile,
      xp: state.xp,
      streak: state.streak,
      lesson: state.lesson,
      duel: state.duel,
      puzzle: state.puzzle,
    });
    if (serialized === previousSerialized) return;
    previousSerialized = serialized;
    void AsyncStorage.setItem(REDUX_PERSIST_KEY, serialized);
    void writeSecureSessionTokens(state.session.accessToken, state.session.refreshToken);
  });
}

export async function ensureAppShellNotificationSetup(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("practice-reminders", {
      name: "Practice reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== "granted") await Notifications.requestPermissionsAsync();
}

export async function refreshSessionOrLogoutOnForeground(auth: AuthService, dispatch: AppDispatch): Promise<void> {
  try {
    const me = await auth.getMe();
    dispatch(setUserIdentity({ email: me.email, username: me.username, avatarUrl: me.avatarUrl ?? null }));
  } catch {
    await AsyncStorage.removeItem(REDUX_PERSIST_KEY);
    await clearSecureSessionTokens();
    resetStoresAfterLogout(dispatch);
  }
}

export function registerGlobalErrorHandlers(): void {
  const u = (globalThis as unknown as { ErrorUtils?: { getGlobalHandler?: () => unknown; setGlobalHandler?: (h: (e: Error, f?: boolean) => void) => void } }).ErrorUtils;
  if (!u?.getGlobalHandler || !u?.setGlobalHandler) return;
  const existing = u.getGlobalHandler();
  u.setGlobalHandler((error, isFatal) => {
    logError("[APP]", error, { isFatal: Boolean(isFatal) });
    if (typeof existing === "function") (existing as (e: Error, f?: boolean) => void)(error, isFatal);
  });
}

export function registerUnhandledRejectionLogger(): () => void {
  const rejectionHandler = (event: PromiseRejectionEvent) => {
    logError("[APP]", event.reason, { type: "unhandledrejection" });
  };
  if (typeof addEventListener !== "function") return () => {};
  addEventListener("unhandledrejection", rejectionHandler as EventListener);
  return () => removeEventListener("unhandledrejection", rejectionHandler as EventListener);
}
