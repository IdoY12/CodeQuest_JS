import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type Chapter from "@/models/Chapter";
import { colors } from "@/theme/theme";
import type { PersonalizationLevel } from "@/data/personalizedExercisePool";
import { useLearnRoadmapData } from "@/hooks/useLearnRoadmapData";
import type { LearnRoadmapNavigation } from "@/types/learnNavigation.types";
import { navigateToPersonalizedLesson, openFirstLessonInChapter } from "@/utils/learnRoadmap";
import { learnRoadmapStyles as s } from "./LearnRoadmapScreen.styles";

type Props = { navigation: LearnRoadmapNavigation };

export function LearnRoadmapScreen({ navigation }: Props) {
  const { path, experience, accessToken, chapterData, loading } = useLearnRoadmapData();
  const onEnter = (index: number, chapterId: string) => {
    if (index > 0) return;
    if (experience) {
      navigateToPersonalizedLesson(navigation, experience as PersonalizationLevel);
      return;
    }
    if (!accessToken) return;
    void openFirstLessonInChapter(navigation, chapterId, accessToken);
  };
  return (
    <SafeAreaView style={s.container} edges={["top", "bottom"]}>
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <FlatList<Chapter>
          style={s.container}
          contentContainerStyle={s.content}
          data={chapterData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Text style={s.title}>{path} Concept Map</Text>}
          renderItem={({ item: chapter, index }) => (
            <View style={s.nodeWrap}>
              <View style={[s.chapterNode, index === 0 && s.chapterNodeActive]}>
                <Text style={s.chapterTitle}>
                  Node {index + 1}: {chapter.title}
                </Text>
                <Text style={s.chapterDesc}>{chapter.description}</Text>
                <Text style={s.nodeStatus}>
                  {index === 0 ? "Current node" : "Locked until previous node complete"}
                </Text>
              </View>
              <Pressable
                style={[s.lessonButton, index > 0 && s.disabled]}
                disabled={index > 0}
                onPress={() => onEnter(index, chapter.id)}
              >
                <Text style={s.lessonButtonLabel}>{index === 0 ? "Enter Node" : "Locked"}</Text>
              </Pressable>
              {index < chapterData.length - 1 ? <View style={s.connector} /> : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
