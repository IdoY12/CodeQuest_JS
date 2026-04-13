import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { colors } from "@/theme/theme";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { markDailyPuzzleSolved } from "@/redux/puzzle-slice";
import { addStudySeconds } from "@/redux/session-slice";
import { API_BASE_URL } from "@/config/network";
import type { DailyPuzzleScreenProps } from "@/types/homeNavigation.types";
import { styles } from "./DailyPuzzleScreen.styles";

type Puzzle = {
  id: number;
  prompt: string;
  orderIndex: number;
  totalCount: number;
  prevId: number | null;
  nextId: number | null;
};

export function DailyPuzzleScreen({ navigation }: DailyPuzzleScreenProps) {
  const dispatch = useAppDispatcher();
  const isFocused = useIsFocused();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const solvedDate = useAppSelector((s) => s.puzzle.lastDailyPuzzleSolvedDate);
  const puzzleSolvedIdByDate = useAppSelector((s) => s.puzzle.puzzleSolvedIdByDate);
  const dateKey = new Date().toLocaleDateString("en-CA");

  const alreadySolved =
    puzzle !== null &&
    (solvedDate === dateKey || puzzleSolvedIdByDate[dateKey] === String(puzzle.id));

  useEffect(() => {
    if (!isFocused) return;
    const t = setInterval(() => dispatch(addStudySeconds(1)), 1000);
    return () => clearInterval(t);
  }, [dispatch, isFocused]);

  const loadPuzzle = useCallback(async (url: string) => {
    setLoading(true);
    setMessage(null);
    setInput("");
    try {
      const { data } = await axios.get<Puzzle>(url);
      setPuzzle(data);
    } catch {
      setMessage("Failed to load puzzle. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPuzzle(`${API_BASE_URL}/daily-puzzles/today`);
  }, [loadPuzzle]);

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
        `${API_BASE_URL}/daily-puzzles/${puzzle.id}/submit`,
        { answer: input },
      );
      if (!data.correct) {
        setMessage("Not quite. Try another valid one-line expression.");
        return;
      }
      dispatch(addXp(40));
      dispatch(markDailyPuzzleSolved({ dateKey, puzzleId: String(puzzle.id) }));
      setMessage("Puzzle solved! +40 XP.");
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
        <Text style={styles.title}>Daily Code Puzzle</Text>
        {puzzle && (
          <Text style={styles.counter}>
            {puzzle.orderIndex + 1} / {puzzle.totalCount}
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
          accessibilityLabel="Daily puzzle answer input"
        />
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navButton, puzzle?.prevId === null && styles.navButtonDisabled]}
            onPress={() => {
              if (puzzle?.prevId !== null && puzzle?.prevId !== undefined) {
                void loadPuzzle(`${API_BASE_URL}/daily-puzzles/${puzzle.prevId}`);
              }
            }}
            disabled={puzzle?.prevId === null}
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
            style={[styles.navButton, puzzle?.nextId === null && styles.navButtonDisabled]}
            onPress={() => {
              if (puzzle?.nextId !== null && puzzle?.nextId !== undefined) {
                void loadPuzzle(`${API_BASE_URL}/daily-puzzles/${puzzle.nextId}`);
              }
            }}
            disabled={puzzle?.nextId === null}
            accessibilityLabel="Next puzzle"
          >
            <Text style={styles.navLabel}>Next →</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.submitButton}
          onPress={() => void onSubmit()}
          accessibilityLabel="Submit daily puzzle answer"
        >
          <Text style={styles.submitLabel}>Submit Puzzle</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close daily puzzle"
        >
          <Text style={styles.secondaryLabel}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
