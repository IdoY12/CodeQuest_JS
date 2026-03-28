import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import { useAppDispatcher } from "@/redux/hooks";
import { dispatchSignInSuccess } from "@/utils/dispatchSignInSuccess";
import { apiRequest } from "@/services/api";
import type AuthResponse from "@/models/AuthResponse";
import { logAuth, logError, logNav } from "@/services/logger";
import { API_BASE_URL } from "@/config/network";
import { Login } from "../login/Login";
import { Signup } from "../signup/Signup";
import { styles } from "./AuthScreen.styles";

export function AuthScreen() {
  const dispatch = useAppDispatcher();
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
  const onSocialPress = () => {
    Alert.alert(
      "Coming Soon",
      "Social login will be available in the full app build. For now, please create an account with email and password.",
    );
  };

  React.useEffect(() => {
    logNav("screen:enter", { screen: "AuthScreen" });
    return () => logNav("screen:leave", { screen: "AuthScreen" });
  }, []);

  const onSubmit = async () => {
    if (!canSubmit || loading) return;
    logAuth("submit:start", { mode: isLogin ? "login" : "register", email });
    if (__DEV__) {
      console.log("[AUTH] submit:start", {
        mode: isLogin ? "login" : "register",
        email,
        apiBaseUrl: API_BASE_URL,
      });
    }
    setLoading(true);
    setError(null);
    try {
      const response = isLogin
        ? await apiRequest<AuthResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          })
        : await apiRequest<AuthResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, username, password }),
          });

      if (__DEV__) {
        console.log("[AUTH] submit:response", {
          mode: isLogin ? "login" : "register",
          userId: response.user.id,
          onboardingCompleted: response.user.onboardingCompleted,
        });
      }
      dispatchSignInSuccess(dispatch, response.user, response.accessToken, response.refreshToken);
      logAuth("submit:success", {
        mode: isLogin ? "login" : "register",
        userId: response.user.id,
        onboardingCompleted: response.user.onboardingCompleted,
      });
    } catch (submitError) {
      if (__DEV__) {
        console.log("[AUTH] submit:error", submitError);
      }
      logError("[AUTH]", submitError, { mode: isLogin ? "login" : "register" });
      setError(submitError instanceof Error ? submitError.message : "Unable to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {isLogin ? (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            secure={secure}
            setSecure={setSecure}
            canSubmit={canSubmit}
            loading={loading}
            error={error}
            onSubmit={onSubmit}
          />
        ) : (
          <Signup
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            secure={secure}
            setSecure={setSecure}
            canSubmit={canSubmit}
            loading={loading}
            error={error}
            onSubmit={onSubmit}
          />
        )}
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}
          onPress={onSocialPress}
          accessibilityLabel="Continue with Apple"
        >
          <View style={styles.socialRow}>
            <FontAwesome name="apple" size={20} color={colors.textPrimary} style={styles.socialIcon} />
            <Text style={styles.secondaryLabel}>Continue with Apple</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}
          onPress={onSocialPress}
          accessibilityLabel="Continue with external provider"
        >
          <View style={styles.socialRow}>
            <FontAwesome name="user-circle-o" size={18} color={colors.textPrimary} style={styles.socialIcon} />
            <Text style={styles.secondaryLabel}>Continue with Provider</Text>
          </View>
        </Pressable>
        <Text style={styles.terms}>By continuing, you agree to our Terms and Privacy Policy.</Text>
        <Pressable onPress={() => setIsLogin((v) => !v)} style={styles.switchAuthBtn}>
          <Text style={styles.switchAuthText}>
            {isLogin ? "Need an account? Register" : "Already have an account? Sign in"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
