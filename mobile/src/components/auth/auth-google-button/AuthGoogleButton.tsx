import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import type { AppDispatch } from "@/redux/store";
import { dispatchSignInSuccess } from "@/utils/dispatchSignInSuccess";
import authService from "@/services/auth";
import { logAuth, logError } from "@/utils/logger";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@/config/googleOAuth";
import { styles } from "../auth-screen/AuthScreen.styles";

WebBrowser.maybeCompleteAuthSession();

export function AuthGoogleButton({ dispatch }: { dispatch: AppDispatch }) {
  const navigation = useNavigation();
  const [busy, setBusy] = useState(false);
  const [req, res, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });
  const finish = useCallback(
    async (idToken: string) => {
      setBusy(true);
      try {
        const r = await authService.loginWithGoogle(idToken);
        dispatchSignInSuccess(dispatch, r.user, r.accessToken, r.refreshToken);
        navigation.goBack();
        logAuth("submit:success", { mode: "google", userId: r.user.id });
      } catch (e) {
        logError("[AUTH]", e, { mode: "google" });
        Alert.alert("Google sign-in", e instanceof Error ? e.message : "Unable to sign in");
      } finally {
        setBusy(false);
      }
    },
    [dispatch, navigation],
  );
  useEffect(() => {
    if (res?.type !== "success") return;
    const id =
      res.authentication?.idToken ?? (typeof res.params?.id_token === "string" ? res.params.id_token : undefined);
    if (!id) return;
    void finish(id);
  }, [res, finish]);
  return (
    <Pressable
      disabled={!req || busy}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}
      onPress={() => void promptAsync()}
      accessibilityLabel="Continue with Google"
    >
      <Text style={styles.secondaryLabel}>Continue with Google</Text>
    </Pressable>
  );
}
