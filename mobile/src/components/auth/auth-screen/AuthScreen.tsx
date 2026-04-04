import type { Dispatch, SetStateAction } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthScreen } from "@/hooks/useAuthScreen";
import { useAppDispatcher } from "@/redux/hooks";
import { colors } from "@/theme/theme";
import { AuthCredentials } from "../auth-credentials/AuthCredentials";
import { styles } from "./AuthScreen.styles";

const onSocialPress = () => {
  Alert.alert(
    "Coming Soon",
    "Social login will be available in the full app build. For now, please create an account with email and password.",
  );
};

function AuthFooter({ isLogin, setIsLogin }: { isLogin: boolean; setIsLogin: Dispatch<SetStateAction<boolean>> }) {
  return (
    <>
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
    </>
  );
}

export function AuthScreen() {
  const dispatch = useAppDispatcher();
  const a = useAuthScreen(dispatch);
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <AuthCredentials {...a} />
        <AuthFooter isLogin={a.isLogin} setIsLogin={a.setIsLogin} />
      </ScrollView>
    </SafeAreaView>
  );
}
