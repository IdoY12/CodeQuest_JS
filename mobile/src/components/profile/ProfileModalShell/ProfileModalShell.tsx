import React from "react";
import { Modal, Text, View } from "react-native";
import { profileModalStyles } from "./ProfileModalShell.styles";

export type ProfileModalShellProps = {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  body: React.ReactNode;
  actions: React.ReactNode;
};

export function ProfileModalShell({ visible, onRequestClose, title, body, actions }: ProfileModalShellProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={profileModalStyles.modalBackdrop}>
        <View style={profileModalStyles.modalCard}>
          <Text style={profileModalStyles.modalTitle}>{title}</Text>
          {body}
          <View style={profileModalStyles.modalActions}>{actions}</View>
        </View>
      </View>
    </Modal>
  );
}
