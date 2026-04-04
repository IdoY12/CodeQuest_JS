import React from "react";
import { View } from "react-native";
import type Exercise from "@/models/Exercise";
import { exerciseLineList } from "@/utils/exerciseLineList";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { ExerciseCodeFillView } from "../ExerciseCodeFillView/ExerciseCodeFillView";
import { ExerciseConceptView } from "../ExerciseConceptView/ExerciseConceptView";
import { ExerciseDragDropView } from "../ExerciseDragDropView/ExerciseDragDropView";
import { ExerciseFindBugView } from "../ExerciseFindBugView/ExerciseFindBugView";
import { ExerciseMcqView } from "../ExerciseMcqView/ExerciseMcqView";
import { ExerciseTapTokenView } from "../ExerciseTapTokenView/ExerciseTapTokenView";
import { exerciseRendererStyles } from "./ExerciseRenderer.styles";

type Props = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseRenderer({
  exercise,
  lessonSource,
  accessToken,
  onLessonExerciseComplete,
}: Props) {
  const shared = { exercise, lessonSource, accessToken, onLessonExerciseComplete };
  const node =
    exercise.type === "CONCEPT_CARD" ? (
      <ExerciseConceptView {...shared} />
    ) : exercise.type === "MULTIPLE_CHOICE" ? (
      <ExerciseMcqView {...shared} />
    ) : exercise.type === "FIND_THE_BUG" ? (
      <ExerciseFindBugView {...shared} lineList={exerciseLineList(exercise.codeSnippet)} />
    ) : exercise.type === "DRAG_DROP" ? (
      <ExerciseDragDropView {...shared} />
    ) : exercise.type === "CODE_FILL" ? (
      <ExerciseCodeFillView {...shared} />
    ) : (
      <ExerciseTapTokenView {...shared} />
    );
  return <View style={exerciseRendererStyles.root}>{node}</View>;
}
