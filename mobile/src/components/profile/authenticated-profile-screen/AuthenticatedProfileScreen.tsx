import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfileScreen } from "@/hooks/useProfileScreen";
import { ProfileAuthenticatedAccount } from "../profile-authenticated-account/ProfileAuthenticatedAccount";
import { ProfileAuthenticatedBot } from "../profile-authenticated-bot/ProfileAuthenticatedBot";
import { ProfileAuthenticatedLearn } from "../profile-authenticated-learn/ProfileAuthenticatedLearn";
import { ProfileAuthenticatedTop } from "../profile-authenticated-top/ProfileAuthenticatedTop";
import { ProfileModal } from "../profile-modal/ProfileModal";
import { styles } from "./AuthenticatedProfileScreen.styles";

export function AuthenticatedProfileScreen() {
  const p = useProfileScreen();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ProfileAuthenticatedTop p={p} />
        <ProfileAuthenticatedAccount p={p} />
        <ProfileAuthenticatedLearn p={p} />
        <ProfileAuthenticatedBot p={p} />
      </ScrollView>
      <ProfileModal p={p} />
    </SafeAreaView>
  );
}
