import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import { usePickOneLessonExercise } from "@/hooks/usePickOneLessonExercise";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { exerciseViewStyles } from "./ExerciseView.styles";

type ExerciseFindBugLineProps = {
  exercise: Exercise;
  lineList: string[];
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseFindBugLine({ exercise, lineList, accessToken, onLessonExerciseComplete }: ExerciseFindBugLineProps) {
  const pickOne = usePickOneLessonExercise(exercise, accessToken, onLessonExerciseComplete);

  return (
    <View style={exerciseViewStyles.exerciseCard}>
      {lineList.map((line, lineIndex) => {
        const lineNumberLabel = String(lineIndex + 1);
        const lineRowHighlightStyle = (() => {
          if (pickOne.lastCheckedAnswer === lineNumberLabel && pickOne.isAnswerCorrect) return exerciseViewStyles.correct;
          if (pickOne.lastCheckedAnswer === lineNumberLabel && !pickOne.isAnswerCorrect && pickOne.hasChecked) return exerciseViewStyles.wrong;
          if (pickOne.selected === lineNumberLabel) return exerciseViewStyles.findBugLineSelected;

          return null;
        })();

        return (
          <Pressable
            key={`${line}-${lineIndex}`}
            onPress={() => pickOne.setSelected(lineNumberLabel)}
            style={lineRowHighlightStyle ? [exerciseViewStyles.findBugLineRow, lineRowHighlightStyle] : exerciseViewStyles.findBugLineRow}
            disabled={pickOne.isAnswerCorrect === true}
          >
            <Text style={exerciseViewStyles.monospaceLineText}>
              {lineIndex + 1}. {line}
            </Text>
          </Pressable>
        );
      })}
      <Pressable
        style={[exerciseViewStyles.lessonButton, !pickOne.canCheck && exerciseViewStyles.disabled]}
        disabled={!pickOne.canCheck}
        onPress={() => void pickOne.runCheck()}
      >
        <Text style={exerciseViewStyles.lessonButtonLabel}>Check Line</Text>
      </Pressable>
      {pickOne.hasChecked && pickOne.isAnswerCorrect ? (
        <>
          <Text style={[exerciseViewStyles.feedback, exerciseViewStyles.feedbackGood]}>Great catch.</Text>
          {pickOne.serverResult?.explanation ? <Text style={exerciseViewStyles.feedback}>{pickOne.serverResult.explanation}</Text> : null}
          <Pressable style={exerciseViewStyles.lessonButton} onPress={pickOne.goNext}>
            <Text style={exerciseViewStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : pickOne.hasChecked ? (
        <Text style={[exerciseViewStyles.feedback, exerciseViewStyles.feedbackBad]}>Not the right line. Try again.</Text>
      ) : null}
    </View>
  );
}
