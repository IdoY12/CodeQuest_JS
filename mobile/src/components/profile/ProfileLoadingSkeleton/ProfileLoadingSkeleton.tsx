import React from "react";
import { View } from "react-native";
import { profileSkeletonStyles } from "./ProfileLoadingSkeleton.styles";

export function ProfileLoadingSkeleton() {
  return (
    <View style={profileSkeletonStyles.skeletonWrap}>
      <View style={profileSkeletonStyles.skeletonCircle} />
      <View style={profileSkeletonStyles.skeletonLineLg} />
      <View style={profileSkeletonStyles.skeletonLineSm} />
      <View style={profileSkeletonStyles.skeletonRow}>
        <View style={profileSkeletonStyles.skeletonCard} />
        <View style={profileSkeletonStyles.skeletonCard} />
        <View style={profileSkeletonStyles.skeletonCard} />
      </View>
    </View>
  );
}
