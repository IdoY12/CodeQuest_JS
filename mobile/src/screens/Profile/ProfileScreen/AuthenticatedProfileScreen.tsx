import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileAccountCard } from "@/screens/Profile/components/ProfileAccountCard/ProfileAccountCard";
import { ProfileDangerZone } from "@/screens/Profile/components/ProfileDangerZone/ProfileDangerZone";
import { ProfileDeleteModal } from "@/screens/Profile/components/ProfileDeleteModal/ProfileDeleteModal";
import { ProfileHeroSection } from "@/screens/Profile/components/ProfileHeroSection/ProfileHeroSection";
import { ProfileLearningPreferencesCard } from "@/screens/Profile/components/ProfileLearningPreferencesCard/ProfileLearningPreferencesCard";
import { ProfileLoadingSkeleton } from "@/screens/Profile/components/ProfileLoadingSkeleton/ProfileLoadingSkeleton";
import { ProfilePasswordModal } from "@/screens/Profile/components/ProfilePasswordModal/ProfilePasswordModal";
import { ProfilePreferencesCard } from "@/screens/Profile/components/ProfilePreferencesCard/ProfilePreferencesCard";
import { ProfileSupportCard } from "@/screens/Profile/components/ProfileSupportCard/ProfileSupportCard";
import { ProfileUsernameModal } from "@/screens/Profile/components/ProfileUsernameModal/ProfileUsernameModal";
import { useProfileScreen } from "@/hooks/useProfileScreen";
import { profileScreenStyles } from "./ProfileScreen.styles";

export function AuthenticatedProfileScreen() {
  const p = useProfileScreen();
  return (
    <SafeAreaView style={profileScreenStyles.container} edges={["top", "bottom"]}>
      <ScrollView style={profileScreenStyles.container} contentContainerStyle={profileScreenStyles.content}>
        {p.screenLoading ? (
          <ProfileLoadingSkeleton />
        ) : (
          <ProfileHeroSection
            avatarUrl={p.avatarUrl}
            initials={p.initials}
            onAvatarPress={p.onAvatarPress}
            username={p.username}
            email={p.email}
            level={p.level}
            duelRating={p.duelRating}
            duelWinRate={p.duelWinRate}
            streakShieldAvailable={p.streakShieldAvailable}
            uploadingAvatar={p.uploadingAvatar}
            uploadProgress={p.uploadProgress}
            stats={p.stats}
          />
        )}
        <ProfileAccountCard
          setUsernameModalVisible={p.setUsernameModalVisible}
          setPasswordModalVisible={p.setPasswordModalVisible}
          draftNotifications={p.draftNotifications}
          setDraftNotifications={p.setDraftNotifications}
        />
        <ProfileLearningPreferencesCard {...p} />
        <ProfilePreferencesCard {...p} />
        <ProfileSupportCard supportRows={p.supportRows} />
        <ProfileDangerZone setDeleteModalVisible={p.setDeleteModalVisible} onLogoutPress={p.onLogoutPress} />
      </ScrollView>
      <ProfileUsernameModal {...p} />
      <ProfilePasswordModal {...p} />
      <ProfileDeleteModal {...p} />
    </SafeAreaView>
  );
}
