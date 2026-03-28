import React from "react";
import { Pressable, Text, View } from "react-native";
import type { UseProfileScreenReturn } from "@/hooks/useProfileScreen";
import { OptionRow } from "../OptionRow/OptionRow";
import { profileSectionCardStyles } from "@/theme/profileSectionCard";

export type ProfileLearningPreferencesCardProps = Pick<
  UseProfileScreenReturn,
  | "goals"
  | "draftGoal"
  | "setDraftGoal"
  | "levels"
  | "draftLevel"
  | "setDraftLevel"
  | "commitmentOptions"
  | "draftCommitment"
  | "setDraftCommitment"
  | "saving"
  | "saveMessage"
  | "onSavePreferences"
>;

export function ProfileLearningPreferencesCard({
  goals: goalItems,
  draftGoal,
  setDraftGoal,
  levels: levelItems,
  draftLevel,
  setDraftLevel,
  commitmentOptions: commitmentItems,
  draftCommitment,
  setDraftCommitment,
  saving,
  saveMessage,
  onSavePreferences,
}: ProfileLearningPreferencesCardProps) {
  return (
    <View style={profileSectionCardStyles.card}>
      <Text style={profileSectionCardStyles.sectionHeader}>Learning Preferences</Text>
      <Text style={profileSectionCardStyles.fieldLabel}>My Goal</Text>
      <OptionRow
        values={goalItems.map((item) => ({ key: item.key, label: item.label }))}
        selected={draftGoal}
        onSelect={(value) => setDraftGoal(value as (typeof goalItems)[number]["key"])}
      />
      <Text style={profileSectionCardStyles.fieldLabel}>My JavaScript Level</Text>
      <OptionRow
        values={levelItems.map((item) => ({ key: item.key, label: item.label }))}
        selected={draftLevel}
        onSelect={(value) => setDraftLevel(value as (typeof levelItems)[number]["key"])}
      />
      <Text style={profileSectionCardStyles.fieldLabel}>Daily Practice Goal</Text>
      <OptionRow
        values={commitmentItems.map((item) => ({ key: item.key, label: item.label }))}
        selected={draftCommitment}
        onSelect={(value) => setDraftCommitment(value as (typeof commitmentItems)[number]["key"])}
      />
      <Pressable
        style={[profileSectionCardStyles.saveButton, saving && profileSectionCardStyles.saveButtonDisabled]}
        disabled={saving}
        onPress={() => void onSavePreferences()}
      >
        <Text style={profileSectionCardStyles.saveButtonLabel}>{saving ? "Saving..." : "Save Preferences"}</Text>
      </Pressable>
      {saveMessage ? <Text style={profileSectionCardStyles.saveMessage}>{saveMessage}</Text> : null}
    </View>
  );
}
