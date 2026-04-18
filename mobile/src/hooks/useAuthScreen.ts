import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppDispatch } from "@/redux/store";
import { dispatchSignInSuccess } from "@/utils/dispatchSignInSuccess";
import { logAuth, logError, logNav } from "@/utils/logger";
import authService from "@/services/auth";

export function useAuthScreen(dispatch: AppDispatch) {
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
    setLoading(true);
    setError(null);

    try {
      const response = isLogin
        ? await authService.login(email, password)
        : await authService.register(email, username, password);
      dispatchSignInSuccess(dispatch, response.user, response.accessToken, response.refreshToken);
      logAuth("submit:success", { mode: isLogin ? "login" : "register", userId: response.user.id });
    } catch (submitError) {
      logError("[AUTH]", submitError, { mode: isLogin ? "login" : "register" });
      setError(submitError instanceof Error ? submitError.message : "Unable to continue");
    } finally {
      setLoading(false);
    }
  }, [canSubmit, dispatch, email, isLogin, loading, password, username]);

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
