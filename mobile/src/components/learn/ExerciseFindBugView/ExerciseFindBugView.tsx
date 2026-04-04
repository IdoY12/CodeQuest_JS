import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type Exercise from "@/models/Exercise";
import type ExerciseSubmitResult from "@/models/ExerciseSubmitResult";
import { useExerciseFindBug } from "@/hooks/useExerciseFindBug";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { submitCurriculumExerciseAnswer } from "@/utils/submitCurriculumExerciseAnswer";
import { exerciseFindBugStyles } from "./ExerciseFindBugView.styles";

type Props = {
  exercise: Exercise;
  lineList: string[];
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseFindBugView({
  exercise,
  lineList,
  lessonSource,
  accessToken,
  onLessonExerciseComplete,
}: Props) {
  const bug = useExerciseFindBug(exercise.id, exercise.correctAnswer ?? "");
  const [curriculumChecked, setCurriculumChecked] = useState(false);
  const [curriculumCorrect, setCurriculumCorrect] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<ExerciseSubmitResult | null>(null);

  useEffect(() => {
    setCurriculumChecked(false);
    setCurriculumCorrect(null);
    setServerResult(null);
  }, [exercise.id]);

  const canCheckPersonalized = !!bug.selected && !bug.hasChecked;
  const canCheckCurriculum = !!bug.selected && !curriculumChecked;
  const canCheck = lessonSource === "personalized" ? canCheckPersonalized : canCheckCurriculum;

  const runCheck = async () => {
    if (!bug.selected) return;
    if (lessonSource === "personalized") {
      bug.runCheck();
      return;
    }
    if (!accessToken) return;
    const result = await submitCurriculumExerciseAnswer(accessToken, exercise, bug.selected);
    setServerResult(result);
    setCurriculumCorrect(result.isCorrect);
    setCurriculumChecked(true);
  };

  const goNext = () => {
    if (!bug.selected) return;
    if (lessonSource === "personalized") {
      onLessonExerciseComplete(bug.selected, {
        source: "personalized",
        isCorrect: Boolean(bug.isCorrect),
        xpReward: exercise.xpReward,
      });
      return;
    }
    if (!serverResult) return;
    onLessonExerciseComplete(bug.selected, { source: "curriculum", submitResult: serverResult });
  };

  const showResults = lessonSource === "personalized" ? bug.hasChecked : curriculumChecked;
  const isCorrectNow = lessonSource === "personalized" ? bug.isCorrect : curriculumCorrect;

  return (
    <View style={exerciseFindBugStyles.exerciseCard}>
      {lessonSource === "personalized" ? (
        <Text style={exerciseFindBugStyles.hearts}>{"❤️".repeat(Math.max(0, bug.attemptsLeft))}</Text>
      ) : null}
      {lineList.map((line, idx) => (
        <Pressable
          key={`${line}-${idx}`}
          onPress={() => bug.setSelected(String(idx + 1))}
          style={[
            exerciseFindBugStyles.line,
            bug.selected === String(idx + 1) && exerciseFindBugStyles.lineSelected,
          ]}
        >
          <Text style={exerciseFindBugStyles.lineText}>
            {idx + 1}. {line}
          </Text>
        </Pressable>
      ))}
      <Pressable
        style={[exerciseFindBugStyles.lessonButton, !canCheck && exerciseFindBugStyles.disabled]}
        disabled={!canCheck}
        onPress={() => void runCheck()}
      >
        <Text style={exerciseFindBugStyles.lessonButtonLabel}>Check Line</Text>
      </Pressable>
      {showResults ? (
        <>
          <Text
            style={[
              exerciseFindBugStyles.feedback,
              isCorrectNow ? exerciseFindBugStyles.feedbackGood : exerciseFindBugStyles.feedbackBad,
            ]}
          >
            {isCorrectNow ? "Great catch." : "Bug revealed. Review explanation and continue."}
          </Text>
          {isCorrectNow && serverResult?.explanation ? (
            <Text style={exerciseFindBugStyles.feedback}>{serverResult.explanation}</Text>
          ) : null}
          <Pressable style={exerciseFindBugStyles.lessonButton} onPress={goNext}>
            <Text style={exerciseFindBugStyles.lessonButtonLabel}>Next</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
