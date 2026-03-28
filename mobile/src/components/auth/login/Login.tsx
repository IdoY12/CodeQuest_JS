import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/theme";
import { styles } from "./Login.styles";

export type LoginProps = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  secure: boolean;
  setSecure: Dispatch<SetStateAction<boolean>>;
  canSubmit: boolean;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
};

export function Login({
  email,
  setEmail,
  password,
  setPassword,
  secure,
  setSecure,
  canSubmit,
  loading,
  error,
  onSubmit,
}: LoginProps) {
  return (
    <>
      <Text style={styles.title}>Welcome back. Sign in to continue.</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email input"
      />
      <View style={styles.passwordRow}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.passwordInput]}
          secureTextEntry={secure}
          accessibilityLabel="Password input"
        />
        <Pressable onPress={() => setSecure((v) => !v)} style={styles.showHide}>
          <Text style={styles.showHideText}>{secure ? "Show" : "Hide"}</Text>
        </Pressable>
      </View>
      <Pressable
        disabled={!canSubmit}
        style={[styles.primaryButton, !canSubmit && styles.disabled]}
        onPress={onSubmit}
        accessibilityLabel="Sign in"
      >
        <Text style={styles.primaryLabel}>{loading ? "Please wait..." : "Sign In"}</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
}
