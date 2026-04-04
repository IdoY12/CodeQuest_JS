import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import { useLearnRoadmapScreen } from "@/hooks/useLearnRoadmapScreen";
import type { LearnRoadmapNavigation } from "@/types/learnNavigation.types";
import type { PersonalizationLevel } from "@/data/personalizedExercisePool";
import { navigateToChapterLesson, navigateToPersonalizedLesson } from "@/utils/learnRoadmapNavigate";
import { learnRoadmapStyles } from "./LearnRoadmapScreen.styles";

type Props = { navigation: LearnRoadmapNavigation };

export function LearnRoadmapScreen({ navigation }: Props) {
  const { path, experience, chapterData, loading, accessToken } = useLearnRoadmapScreen();
  const onEnter = (index: number, chapterId: string) => {
    if (index > 0) return;
    if (experience) {
      navigateToPersonalizedLesson(navigation, experience as PersonalizationLevel);
      return;
    }
    void navigateToChapterLesson(navigation, chapterId, accessToken);
  };
  return (
    <SafeAreaView style={learnRoadmapStyles.container} edges={["top", "bottom"]}>
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <FlatList
          style={learnRoadmapStyles.container}
          contentContainerStyle={learnRoadmapStyles.content}
          data={chapterData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Text style={learnRoadmapStyles.title}>{path} Concept Map</Text>}
          renderItem={({ item: chapter, index }) => (
            <View style={learnRoadmapStyles.nodeWrap}>
              <View style={[learnRoadmapStyles.chapterNode, index === 0 && learnRoadmapStyles.chapterNodeActive]}>
                <Text style={learnRoadmapStyles.chapterTitle}>
                  Node {index + 1}: {chapter.title}
                </Text>
                <Text style={learnRoadmapStyles.chapterDesc}>{chapter.description}</Text>
                <Text style={learnRoadmapStyles.nodeStatus}>
                  {index === 0 ? "Current node" : "Locked until previous node complete"}
                </Text>
              </View>
              <Pressable
                style={[learnRoadmapStyles.lessonButton, index > 0 && learnRoadmapStyles.disabled]}
                disabled={index > 0}
                onPress={() => onEnter(index, chapter.id)}
              >
                <Text style={learnRoadmapStyles.lessonButtonLabel}>{index === 0 ? "Enter Node" : "Locked"}</Text>
              </Pressable>
              {index < chapterData.length - 1 ? <View style={learnRoadmapStyles.connector} /> : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
