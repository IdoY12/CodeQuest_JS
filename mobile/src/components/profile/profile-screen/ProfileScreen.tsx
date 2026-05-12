import { View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { AuthenticatedProfileScreen } from "../authenticated-profile-screen/AuthenticatedProfileScreen";
import { GuestProfileBody } from "./GuestProfileBody";
import { styles } from "./ProfileScreen.styles";

export function ProfileScreen() {
  const isGuest = useAppSelector((s) => s.session.isGuest);
  return (
    <View style={styles.root}>{isGuest ? <GuestProfileBody /> : <AuthenticatedProfileScreen />}</View>
  );
}
