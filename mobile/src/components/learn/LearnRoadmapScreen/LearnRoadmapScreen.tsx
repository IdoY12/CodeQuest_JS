import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import { useLearnRoadmapData } from "@/hooks/useLearnRoadmapData";
import type { LearnRoadmapNavigation } from "@/types/learnNavigation.types";
import { learnRoadmapStyles as s } from "./LearnRoadmapScreen.styles";

type Props = { navigation: LearnRoadmapNavigation };

export function LearnRoadmapScreen({ navigation }: Props) {
  const { activeExperience, levelRows } = useLearnRoadmapData();
  return (
    <SafeAreaView style={s.container} edges={["top", "bottom"]}>
      <FlatList
        style={s.container}
        contentContainerStyle={s.content}
        data={levelRows}
        keyExtractor={(item) => item.experienceLevel}
        ListHeaderComponent={
          <Text style={s.title}>
            Practice by level{"\n"}
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              Your active preference: {activeExperience}. Each level keeps its own place in the exercise list.
            </Text>
          </Text>
        }
        renderItem={({ item }) => (
          <View style={s.nodeWrap}>
            <View style={s.chapterNode}>
              <Text style={s.chapterTitle}>{item.title}</Text>
              <Text style={s.chapterDesc}>{item.description}</Text>
            </View>
            <Pressable
              style={s.lessonButton}
              onPress={() =>
                navigation.navigate("Lesson", {
                  experienceLevel: item.experienceLevel,
                  lessonTitle: item.title,
                })
              }
            >
              <Text style={s.lessonButtonLabel}>Start</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
