import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileAccountCard } from "@/components/profile/ProfileAccountCard/ProfileAccountCard";
import { ProfileDangerZone } from "@/components/profile/ProfileDangerZone/ProfileDangerZone";
import { ProfileDeleteModal } from "@/components/profile/ProfileDeleteModal/ProfileDeleteModal";
import { ProfileHeroSection } from "@/components/profile/ProfileHeroSection/ProfileHeroSection";
import { ProfileLearningPreferencesCard } from "@/components/profile/ProfileLearningPreferencesCard/ProfileLearningPreferencesCard";
import { ProfileLoadingSkeleton } from "@/components/profile/ProfileLoadingSkeleton/ProfileLoadingSkeleton";
import { ProfilePasswordModal } from "@/components/profile/ProfilePasswordModal/ProfilePasswordModal";
import { ProfilePreferencesCard } from "@/components/profile/ProfilePreferencesCard/ProfilePreferencesCard";
import { ProfileSupportCard } from "@/components/profile/ProfileSupportCard/ProfileSupportCard";
import { ProfileUsernameModal } from "@/components/profile/ProfileUsernameModal/ProfileUsernameModal";
import { useProfileScreen } from "@/hooks/useProfileScreen";
import { authenticatedProfileScreenStyles as screenStyles } from "./AuthenticatedProfileScreen.styles";

export function AuthenticatedProfileScreen() {
  const p = useProfileScreen();
  return (
    <SafeAreaView style={screenStyles.container} edges={["top", "bottom"]}>
      <ScrollView style={screenStyles.container} contentContainerStyle={screenStyles.content}>
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
