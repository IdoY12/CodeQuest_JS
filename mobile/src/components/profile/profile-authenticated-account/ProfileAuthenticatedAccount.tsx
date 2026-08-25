import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { AppIcon } from "@/components/common/AppIcon/AppIcon";
import { TerminalFrame } from "@/components/common/TerminalFrame/TerminalFrame";
import { profileFormRowsStyles } from "@/theme/profileFormRows";
import { SetPasswordModal } from "../profile-set-password/SetPasswordModal";
import { a } from "./ProfileAuthenticatedAccount.styles";

export function ProfileAuthenticatedAccount({ p }: { p: UseProfileScreenReturn }) {
  // OAuth-only accounts have no password to change; they get the OTP "Set Password" flow instead.
  const [setPasswordVisible, setSetPasswordVisible] = useState(false);
  return (
    <TerminalFrame label="account" style={a.cardStack}>
      <Pressable style={({ pressed }) => [profileFormRowsStyles.rowWithSwitch, pressed && a.rowPress]} onPress={() => p.setUsernameModalVisible(true)}>
        <View style={profileFormRowsStyles.rowLeft}>
          <AppIcon name="account" />
          <Text style={profileFormRowsStyles.rowText}>Edit Username</Text>
        </View>
        <Text style={a.chev}>›</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [profileFormRowsStyles.rowWithSwitch, pressed && a.rowPress]}
        onPress={() => (p.hasPassword ? p.setPasswordModalVisible(true) : setSetPasswordVisible(true))}
      >
        <View style={profileFormRowsStyles.rowLeft}>
          <AppIcon name="lock" />
          <Text style={profileFormRowsStyles.rowText}>{p.hasPassword ? "Change Password" : "Set Password"}</Text>
        </View>
        <Text style={a.chev}>›</Text>
      </Pressable>
      {setPasswordVisible ? <SetPasswordModal onClose={() => setSetPasswordVisible(false)} /> : null}
      <View style={profileFormRowsStyles.rowWithSwitch}>
        <View style={profileFormRowsStyles.rowLeft}>
          <AppIcon name="bell" />
          <Text style={profileFormRowsStyles.rowText}>Notifications</Text>
        </View>
        <Switch style={profileFormRowsStyles.switchControl} value={p.draftNotifications} onValueChange={p.onNotificationsEnabledChange} />
      </View>
    </TerminalFrame>
  );
}
