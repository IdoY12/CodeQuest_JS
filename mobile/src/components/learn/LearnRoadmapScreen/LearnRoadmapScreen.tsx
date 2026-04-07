import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import { useLearnRoadmapData } from "@/hooks/useLearnRoadmapData";
import type { LearnRoadmapNavigation } from "@/types/learnNavigation.types";
import { learnRoadmapStyles as s } from "./LearnRoadmapScreen.styles";

type Props = { navigation: LearnRoadmapNavigation };

export function LearnRoadmapScreen({ navigation }: Props) {
  const { path, experience, loading, roadmapBlocks } = useLearnRoadmapData();
  const onEnter = (blockNumber: number, unlocked: boolean) => {
    if (!unlocked) return;
    navigation.navigate("Lesson", {
      lessonId: `personalized-${experience}-block-${blockNumber}`,
      lessonTitle: `Block ${blockNumber}: ${experience} Practice`,
      personalizedLevel: experience,
    });
  };
  return (
    <SafeAreaView style={s.container} edges={["top", "bottom"]}>
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <FlatList
          style={s.container}
          contentContainerStyle={s.content}
          data={roadmapBlocks}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Text style={s.title}>{path} Concept Map</Text>}
          renderItem={({ item: block, index }) => (
            <View style={s.nodeWrap}>
              <View style={[s.chapterNode, block.unlocked && s.chapterNodeActive]}>
                <Text style={s.chapterTitle}>
                  Node {index + 1}: {block.title}
                </Text>
                <Text style={s.chapterDesc}>{block.description}</Text>
                <Text style={s.nodeStatus}>{block.done ? "Completed 10 / 10" : `${block.completed} / ${block.total} completed`}</Text>
              </View>
              <Pressable
                style={[s.lessonButton, !block.unlocked && s.disabled]}
                disabled={!block.unlocked}
                onPress={() => onEnter(index + 1, block.unlocked)}
              >
                <Text style={s.lessonButtonLabel}>{block.done ? "Completed" : block.unlocked ? "Start" : "Locked"}</Text>
              </Pressable>
              {index < roadmapBlocks.length - 1 ? <View style={s.connector} /> : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
