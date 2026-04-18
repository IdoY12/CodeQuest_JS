import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CodeSnippet } from "@/components/common/CodeSnippet/CodeSnippet";
import { useDuelActiveDuelScreen } from "@/hooks/useDuelActiveDuelScreen";
import type { ActiveDuelScreenProps } from "@/types/duelNavigation.types";
import { DuelActiveAnswerZone } from "./DuelActiveAnswerZone";
import { styles } from "./DuelNavigator.styles";

export function DuelActiveDuelScreen({ navigation }: ActiveDuelScreenProps) {
  const u = useDuelActiveDuelScreen(navigation);

  if (!u.round) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <Text style={styles.sub}>Waiting for round start...</Text>
      </SafeAreaView>
    );
  }

  const { round } = u;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.duelContent} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>
            {u.username} {u.myScore}
          </Text>
          <Text style={styles.score}>Round {u.roundNumber}/5</Text>
          <View style={styles.scoreCellEnd}>
            {u.opponentAvatarUrl ? (
              <Image source={{ uri: u.opponentAvatarUrl }} style={styles.duelMiniAvatar} />
            ) : (
              <View style={styles.duelMiniInitial}>
                <Text style={styles.duelMiniInitialTxt}>{(u.opponentName || "?").slice(0, 1).toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.score} numberOfLines={1}>
              {u.opponentName} {u.oppScore}
            </Text>
          </View>
        </View>
        <Text style={styles.sub}>You can choose up to 3 answers. ({u.attemptsLeft} remaining)</Text>
        <Text style={styles.cardTitle}>{round.prompt}</Text>
        <View style={styles.codeWrap}>
          <CodeSnippet code={round.codeSnippet} />
        </View>
        <View style={styles.card}>
          <DuelActiveAnswerZone round={round} selected={u.selected} locked={u.locked} submit={u.submit} />
        </View>
      </ScrollView>
      {u.overlayVisible ? (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Round Over</Text>
          <Text style={styles.overlayText}>Correct answer: {u.lastCorrectAnswer}</Text>
          <Text style={styles.overlayText}>
            {u.myScore === u.oppScore ? "Tie round" : u.myScore > u.oppScore ? "You lead" : "Opponent leads"}
          </Text>
          <Text style={styles.overlayText}>
            Score: {u.myScore} - {u.oppScore}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
