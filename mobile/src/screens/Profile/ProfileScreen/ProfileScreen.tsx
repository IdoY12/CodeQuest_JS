import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectIsGuest } from "@/store/selectors";
import { AuthenticatedProfileScreen } from "./AuthenticatedProfileScreen";
import { GuestProfileScreen } from "./GuestProfileScreen";

export function ProfileScreen() {
  const isGuest = useAppSelector(selectIsGuest);
  if (isGuest) return <GuestProfileScreen />;
  return <AuthenticatedProfileScreen />;
}
