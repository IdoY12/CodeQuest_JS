import React from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { colors } from "@/theme/theme";
import { ProfileStatPill } from "../ProfileStatPill/ProfileStatPill";
import type { ProfileHeroSectionProps } from "@/types/profile.types";
import { profileHeroStyles } from "./ProfileHeroSection.styles";

export function ProfileHeroSection({
  avatarUrl,
  initials,
  onAvatarPress,
  username,
  email,
  level,
  duelRating,
  duelWinRate,
  streakShieldAvailable,
  uploadingAvatar,
  uploadProgress,
  stats,
}: ProfileHeroSectionProps) {
  const shieldLabel = streakShieldAvailable ? "🛡️ Streak Shield active" : "No streak shield active";
  return (
    <>
      <View style={profileHeroStyles.hero}>
        <Pressable style={profileHeroStyles.avatarShell} onPress={onAvatarPress}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={profileHeroStyles.avatarImage} />
          ) : (
            <View style={profileHeroStyles.initialsAvatar}>
              <Text style={profileHeroStyles.initialsText}>{initials}</Text>
            </View>
          )}
          <View style={profileHeroStyles.cameraBadge}>
            <Text style={profileHeroStyles.cameraBadgeText}>✎</Text>
          </View>
        </Pressable>
        <Text style={profileHeroStyles.name}>{username}</Text>
        <Text style={profileHeroStyles.email}>{email}</Text>
        <Text style={profileHeroStyles.meta}>
          Level {level} · Duel {duelRating} · {duelWinRate} win rate
        </Text>
        <Text style={profileHeroStyles.shieldText}>{shieldLabel}</Text>
      </View>
      {uploadingAvatar ? (
        <View style={profileHeroStyles.uploadCard}>
          <ActivityIndicator color={colors.accent} />
          <Text style={profileHeroStyles.uploadText}>Uploading avatar... {uploadProgress}%</Text>
        </View>
      ) : null}
      <View style={profileHeroStyles.statsRow}>
        {stats.map((item) => (
          <ProfileStatPill key={item.label} item={item} />
        ))}
      </View>
    </>
  );
}
