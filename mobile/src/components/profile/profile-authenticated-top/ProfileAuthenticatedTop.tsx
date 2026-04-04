import React from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { colors } from "@/theme/theme";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { t } from "./ProfileAuthenticatedTop.styles";

export function ProfileAuthenticatedTop({ p }: { p: UseProfileScreenReturn }) {
  if (p.screenLoading) {
    return (
      <View style={t.skWrap}>
        <View style={t.skCirc} />
        <View style={t.skLg} />
        <View style={t.skSm} />
        <View style={t.skRow}>
          <View style={t.skCard} />
          <View style={t.skCard} />
          <View style={t.skCard} />
        </View>
      </View>
    );
  }
  const shield = p.streakShieldAvailable ? "🛡️ Streak Shield active" : "No streak shield active";
  return (
    <>
      <View style={t.hero}>
        <Pressable style={t.avatarShell} onPress={p.onAvatarPress}>
          {p.avatarUrl ? (
            <Image source={{ uri: p.avatarUrl }} style={t.avatarImg} />
          ) : (
            <View style={t.initialsAv}>
              <Text style={t.initialsTxt}>{p.initials}</Text>
            </View>
          )}
          <View style={t.camBadge}>
            <Text style={t.camTxt}>✎</Text>
          </View>
        </Pressable>
        <Text style={t.name}>{p.username}</Text>
        <Text style={t.email}>{p.email}</Text>
        <Text style={t.meta}>
          Level {p.level} · Duel {p.duelRating} · {p.duelWinRate} win rate
        </Text>
        <Text style={t.shield}>{shield}</Text>
      </View>
      {p.uploadingAvatar ? (
        <View style={t.upCard}>
          <ActivityIndicator color={colors.accent} />
          <Text style={t.upTxt}>Uploading avatar... {p.uploadProgress}%</Text>
        </View>
      ) : null}
      <View style={t.statsRow}>
        {p.stats.map((item) => (
          <View key={item.label} style={t.pill}>
            <Text style={t.pillIcon}>{item.icon}</Text>
            <Text style={t.pillVal}>{item.value}</Text>
            <Text style={t.pillLbl}>{item.label}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
