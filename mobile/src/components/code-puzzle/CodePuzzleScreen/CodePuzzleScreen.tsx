import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/theme";
import type { CodePuzzleScreenProps } from "@/types/homeNavigation.types";
import { useCodePuzzle } from "@/hooks/useCodePuzzle";
import { styles } from "./CodePuzzleScreen.styles";

export function CodePuzzleScreen({ navigation }: CodePuzzleScreenProps) {
  const { loading, puzzle, puzzles, currentIndex, setCurrentIndex, input, setInput, message, onSubmit } = useCodePuzzle();

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
        {puzzle && <Text style={styles.counter}>{puzzle.orderIndex + 1} / {puzzles.length}</Text>}
        <Text style={styles.prompt}>{puzzle?.prompt ?? ""}</Text>
        <TextInput
          style={styles.input} value={input} onChangeText={setInput} autoCapitalize="none"
          autoCorrect={false} placeholder="Type one-line expression" placeholderTextColor={colors.textMuted}
          multiline={false} accessibilityLabel="Code puzzle answer input"
        />
        <View style={styles.navRow}>
          <Pressable style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]} onPress={() => { setCurrentIndex((i) => Math.max(0, i - 1)); setInput(""); }} disabled={currentIndex === 0} accessibilityLabel="Previous puzzle">
            <Text style={styles.navLabel}>← Prev</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => setInput("")} accessibilityLabel="Reset answer">
            <Text style={styles.navLabel}>Reset</Text>
          </Pressable>
          <Pressable style={[styles.navButton, currentIndex === puzzles.length - 1 && styles.navButtonDisabled]} onPress={() => { setCurrentIndex((i) => Math.min(puzzles.length - 1, i + 1)); setInput(""); }} disabled={currentIndex === puzzles.length - 1} accessibilityLabel="Next puzzle">
            <Text style={styles.navLabel}>Next →</Text>
          </Pressable>
        </View>
        <Pressable style={styles.submitButton} onPress={() => void onSubmit()} accessibilityLabel="Submit code puzzle answer">
          <Text style={styles.submitLabel}>Submit Puzzle</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()} accessibilityLabel="Close code puzzle">
          <Text style={styles.secondaryLabel}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
