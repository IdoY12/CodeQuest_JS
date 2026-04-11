import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import { useAppDispatcher, useAppSelector } from "@/redux/hooks";
import { addXp } from "@/redux/xp-slice";
import { markDailyPuzzleSolved } from "@/redux/puzzle-slice";
import { addStudySeconds } from "@/redux/session-slice";
import { getPuzzleForDate, isPuzzleAnswerCorrect } from "@/data/dailyPuzzles";
import type { DailyPuzzleScreenProps } from "@/types/homeNavigation.types";
import { styles } from "./DailyPuzzleScreen.styles";

export function DailyPuzzleScreen({ navigation }: DailyPuzzleScreenProps) {
  const dispatch = useAppDispatcher();
  const isFocused = useIsFocused();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const solvedDate = useAppSelector((s) => s.puzzle.lastDailyPuzzleSolvedDate);
  const puzzleSolvedIdByDate = useAppSelector((s) => s.puzzle.puzzleSolvedIdByDate);
  const dateKey = new Date().toLocaleDateString("en-CA");
  const puzzle = useMemo(() => getPuzzleForDate(new Date()), []);
  const alreadySolved = solvedDate === dateKey || puzzleSolvedIdByDate[dateKey] === puzzle.id;
  React.useEffect(() => {
    if (!isFocused) return;
    const t = setInterval(() => dispatch(addStudySeconds(1)), 1000);
    return () => clearInterval(t);
  }, [dispatch, isFocused]);

  const onSubmit = () => {
    if (alreadySolved) {
      setMessage("You already solved today's puzzle.");
      return;
    }
    if (!input.trim()) {
      setMessage("Please enter a one-line JavaScript expression.");
      return;
    }
    if (!isPuzzleAnswerCorrect(puzzle, input)) {
      setMessage("Not quite. Try another valid one-line expression.");
      return;
    }
    dispatch(addXp(40));
    dispatch(markDailyPuzzleSolved({ dateKey, puzzleId: puzzle.id }));
    setMessage("Puzzle solved! +40 XP.");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Daily Code Puzzle</Text>
        <Text style={styles.prompt}>{puzzle.prompt}</Text>
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
        <Pressable style={styles.submitButton} onPress={onSubmit} accessibilityLabel="Submit daily puzzle answer">
          <Text style={styles.submitLabel}>Submit Puzzle</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()} accessibilityLabel="Close daily puzzle">
          <Text style={styles.secondaryLabel}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
