import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { colors } from "@/theme/theme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { markCodePuzzleSolved } from "@/redux/puzzle-slice";
import { addStudySeconds } from "@/redux/session-slice";
import { API_BASE_URL } from "@/config/network";
import type { CodePuzzleScreenProps } from "@/types/homeNavigation.types";
import { styles } from "./CodePuzzleScreen.styles";

type Puzzle = {
  id: number;
  prompt: string;
  orderIndex: number;
};

const STUDY_TIMER_INTERVAL_MS = 1000;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const CODE_PUZZLE_XP_REWARD = 40;

export function CodePuzzleScreen({ navigation }: CodePuzzleScreenProps) {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const puzzle = puzzles[currentIndex] ?? null;

  const solvedDate = useAppSelector((s) => s.puzzle.lastCodePuzzleSolvedDate);
  const puzzleSolvedIdByDate = useAppSelector((s) => s.puzzle.puzzleSolvedIdByDate);
  const dateKey = new Date().toLocaleDateString("en-CA");

  const alreadySolved =
    puzzle !== null &&
    (solvedDate === dateKey || puzzleSolvedIdByDate[dateKey] === String(puzzle.id));

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
    if (alreadySolved) {
      setMessage("You already solved today's puzzle.");
      return;
    }
    if (!input.trim()) {
      setMessage("Please enter a one-line JavaScript expression.");
      return;
    }
    try {
      const { data } = await axios.post<{ correct: boolean }>(
        `${API_BASE_URL}/code-puzzles/${puzzle.id}/submit`,
        { answer: input },
      );
      if (!data.correct) {
        setMessage("Not quite. Try another valid one-line expression.");
        return;
      }
      dispatch(addXp(CODE_PUZZLE_XP_REWARD));
      dispatch(markCodePuzzleSolved({ dateKey, puzzleId: String(puzzle.id) }));
      setMessage(`Puzzle solved! +${CODE_PUZZLE_XP_REWARD} XP.`);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
  }, [alreadySolved, dateKey, dispatch, input, puzzle]);

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
          <Pressable
            style={styles.navButton}
            onPress={() => setInput("")}
            accessibilityLabel="Reset answer"
          >
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
