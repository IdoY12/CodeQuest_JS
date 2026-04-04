import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppDispatch } from "@/redux/store";
import { dispatchSignInSuccess } from "@/utils/dispatchSignInSuccess";
import { logAuth, logError, logNav } from "@/services/logger";
import { API_BASE_URL } from "@/config/network";
import { useService } from "@/hooks/useService";
import AuthService from "@/services/AuthService";

export function useAuthScreen(dispatch: AppDispatch) {
  const auth = useService(AuthService);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = useMemo(
    () => email.includes("@") && password.length >= 6 && (isLogin || username.length >= 2),
    [email, password, username, isLogin],
  );
  useEffect(() => {
    logNav("screen:enter", { screen: "AuthScreen" });
    return () => logNav("screen:leave", { screen: "AuthScreen" });
  }, []);
  const onSubmit = useCallback(async () => {
    if (!canSubmit || loading) return;
    logAuth("submit:start", { mode: isLogin ? "login" : "register", email });
    if (__DEV__) console.log("[AUTH] submit:start", { mode: isLogin ? "login" : "register", email, apiBaseUrl: API_BASE_URL });
    setLoading(true);
    setError(null);
    try {
      const response = isLogin
        ? await auth.login(email, password)
        : await auth.register(email, username, password);
      if (__DEV__) console.log("[AUTH] submit:response", { mode: isLogin ? "login" : "register", userId: response.user.id });
      dispatchSignInSuccess(dispatch, response.user, response.accessToken, response.refreshToken);
      logAuth("submit:success", { mode: isLogin ? "login" : "register", userId: response.user.id, onboardingCompleted: response.user.onboardingCompleted });
    } catch (submitError) {
      if (__DEV__) console.log("[AUTH] submit:error", submitError);
      logError("[AUTH]", submitError, { mode: isLogin ? "login" : "register" });
      setError(submitError instanceof Error ? submitError.message : "Unable to continue");
    } finally {
      setLoading(false);
    }
  }, [auth, canSubmit, dispatch, email, isLogin, loading, password, username]);
  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    secure,
    setSecure,
    isLogin,
    setIsLogin,
    loading,
    error,
    canSubmit,
    onSubmit,
  };
}
