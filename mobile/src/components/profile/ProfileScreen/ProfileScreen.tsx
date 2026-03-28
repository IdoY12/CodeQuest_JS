import React from "react";
import { View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { AuthenticatedProfileScreen } from "@/components/profile/AuthenticatedProfileScreen/AuthenticatedProfileScreen";
import { GuestProfileScreen } from "@/components/profile/GuestProfileScreen/GuestProfileScreen";
import { profileScreenRouterStyles } from "./ProfileScreen.styles";

export function ProfileScreen() {
  const isGuest = useAppSelector((s) => s.session.isGuest);
  return (
    <View style={profileScreenRouterStyles.root}>
      {isGuest ? <GuestProfileScreen /> : <AuthenticatedProfileScreen />}
    </View>
  );
}
