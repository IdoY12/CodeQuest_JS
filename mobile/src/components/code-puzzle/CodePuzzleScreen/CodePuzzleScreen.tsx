import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { colors } from "@/theme/theme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { runStreakAppOpen, runStreakQualifyingExercise } from "@/redux/streak-slice";
import { hydrateStreak } from "@/redux/streak-slice";
import { hydrateXp } from "@/redux/xp-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { addStudySeconds } from "@/redux/session-slice";
import { API_BASE_URL } from "@/config/network";
import type { CodePuzzleScreenProps } from "@/types/homeNavigation.types";
import { styles } from "./CodePuzzleScreen.styles";

type Puzzle = {
  id: number;
  prompt: string;
  orderIndex: number;
};

type PuzzleSubmitResponse = {
  correct: boolean;
  streakCurrent?: number;
  xpTotal?: number;
};

const STUDY_TIMER_INTERVAL_MS = 1000;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function CodePuzzleScreen({ navigation }: CodePuzzleScreenProps) {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const puzzle = puzzles[currentIndex] ?? null;

  useEffect(() => {
    if (!isFocused) return;
    const t = setInterval(() => dispatch(addStudySeconds(1)), STUDY_TIMER_INTERVAL_MS);
    return () => clearInterval(t);
  }, [dispatch, isFocused]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessage(null);
    axios
      .get<Puzzle[]>(`${API_BASE_URL}/code-puzzles/all`)
      .then(({ data }) => {
        if (!cancelled) {
          setPuzzles(data);
          const todayIndex = Math.floor(Date.now() / MS_PER_DAY) % data.length;
          setCurrentIndex(todayIndex);
        }
      })
      .catch(() => {
        if (!cancelled) setMessage("Failed to load puzzles. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = useCallback(async () => {
    if (!puzzle) return;

    if (!input.trim()) {
      setMessage("Please enter a one-line JavaScript expression.");
      return;
    }

    const clientLocalDate = getStreakCalendarDate();

    try {
      const headers =
        accessToken && !isGuest ? { Authorization: `Bearer ${accessToken}` } : ({} as Record<string, string>);
      const { data } = await axios.post<PuzzleSubmitResponse>(
        `${API_BASE_URL}/code-puzzles/${puzzle.id}/submit`,
        { answer: input, clientLocalDate },
        { headers },
      );

      if (!data.correct) {
        setMessage("Not quite. Try another valid one-line expression.");
        return;
      }

      if (isGuest) {
        const today = clientLocalDate;
        dispatch(runStreakAppOpen({ today }));
        dispatch(runStreakQualifyingExercise({ today }));
        dispatch(addXp(XP_PER_CORRECT_EXERCISE));
      } else {
        if (typeof data.xpTotal === "number") {
          dispatch(
            hydrateXp({
              xpTotal: data.xpTotal,
              level: Math.max(1, Math.floor(data.xpTotal / XP_PER_CORRECT_EXERCISE) + 1),
            }),
          );
        } else {
          dispatch(addXp(XP_PER_CORRECT_EXERCISE));
        }
        if (typeof data.streakCurrent === "number") {
          dispatch(
            hydrateStreak({
              streakCurrent: data.streakCurrent,
              lastActivityDate: null,
              lastCheckedDate: null,
            }),
          );
        }
      }

      setMessage(`Puzzle solved! +${XP_PER_CORRECT_EXERCISE} XP.`);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
  }, [accessToken, dispatch, input, isGuest, puzzle]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Code Puzzle</Text>
        {puzzle && (
          <Text style={styles.counter}>
            {puzzle.orderIndex + 1} / {puzzles.length}
          </Text>
        )}
        <Text style={styles.prompt}>{puzzle?.prompt ?? ""}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Type one-line expression"
          placeholderTextColor={colors.textMuted}
          multiline={false}
          accessibilityLabel="Code puzzle answer input"
        />
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={() => {
              setCurrentIndex((i) => Math.max(0, i - 1));
              setInput("");
              setMessage(null);
            }}
            disabled={currentIndex === 0}
            accessibilityLabel="Previous puzzle"
          >
            <Text style={styles.navLabel}>← Prev</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => setInput("")} accessibilityLabel="Reset answer">
            <Text style={styles.navLabel}>Reset</Text>
          </Pressable>
          <Pressable
            style={[styles.navButton, currentIndex === puzzles.length - 1 && styles.navButtonDisabled]}
            onPress={() => {
              setCurrentIndex((i) => Math.min(puzzles.length - 1, i + 1));
              setInput("");
              setMessage(null);
            }}
            disabled={currentIndex === puzzles.length - 1}
            accessibilityLabel="Next puzzle"
          >
            <Text style={styles.navLabel}>Next →</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.submitButton}
          onPress={() => void onSubmit()}
          accessibilityLabel="Submit code puzzle answer"
        >
          <Text style={styles.submitLabel}>Submit Puzzle</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close code puzzle"
        >
          <Text style={styles.secondaryLabel}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
