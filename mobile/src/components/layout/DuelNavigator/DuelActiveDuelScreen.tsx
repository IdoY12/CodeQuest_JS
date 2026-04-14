import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CodeSnippet } from "@/components/common/CodeSnippet/CodeSnippet";
import { useDuelActiveDuelScreen } from "@/hooks/useDuelActiveDuelScreen";
import type { ActiveDuelScreenProps } from "@/types/duelNavigation.types";
import { DUEL_ACTIVE_ROUND_SECONDS } from "@/constants/duelUiConstants";
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
        <View style={styles.progressBar}>
          <View style={[styles.progressInner, { width: `${(u.timeLeft / DUEL_ACTIVE_ROUND_SECONDS) * 100}%` }]} />
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>
            {u.username} {u.myScore}
          </Text>
          <Text style={styles.score}>Round {u.roundNumber}/5</Text>
          <Text style={styles.score}>
            {u.opponentName} {u.oppScore}
          </Text>
        </View>
        <Text style={styles.cardTitle}>{round.prompt}</Text>
        <View style={styles.codeWrap}>
          <CodeSnippet code={round.codeSnippet} />
        </View>
        <View style={styles.card}>
          <ScrollView style={styles.answersScroll} nestedScrollEnabled>
            <DuelActiveAnswerZone round={round} selected={u.selected} submit={u.submit} />
          </ScrollView>
        </View>
      </ScrollView>
      {u.overlayVisible ? (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Round Update</Text>
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
