import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/theme";
import { styles } from "./Signup.styles";

export type SignupProps = {
  email: string;
  setEmail: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  secure: boolean;
  setSecure: Dispatch<SetStateAction<boolean>>;
  canSubmit: boolean;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
};

export function Signup({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  secure,
  setSecure,
  canSubmit,
  loading,
  error,
  onSubmit,
}: SignupProps) {
  return (
    <>
      <Text style={styles.title}>Save your progress. Create a free account.</Text>
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
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        accessibilityLabel="Username input"
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
        accessibilityLabel="Create account"
      >
        <Text style={styles.primaryLabel}>{loading ? "Please wait..." : "Create Account"}</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
}
