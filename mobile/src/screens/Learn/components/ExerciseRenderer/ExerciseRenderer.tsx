import React from "react";
import { View } from "react-native";
import type { ApiExercise } from "@/types/learn.types";
import { exerciseLineList } from "@/utils/exerciseLineList";
import { ExerciseCodeFillView } from "../ExerciseCodeFillView/ExerciseCodeFillView";
import { ExerciseConceptView } from "../ExerciseConceptView/ExerciseConceptView";
import { ExerciseDragDropView } from "../ExerciseDragDropView/ExerciseDragDropView";
import { ExerciseFindBugView } from "../ExerciseFindBugView/ExerciseFindBugView";
import { ExerciseMcqView } from "../ExerciseMcqView/ExerciseMcqView";
import { ExerciseTapTokenView } from "../ExerciseTapTokenView/ExerciseTapTokenView";
import { exerciseRendererStyles } from "./ExerciseRenderer.styles";

type Props = {
  exercise: ApiExercise;
  onAnswer: (isCorrect: boolean, xp: number, answer: string) => void;
};

export function ExerciseRenderer({ exercise, onAnswer }: Props) {
  const node =
    exercise.type === "CONCEPT_CARD" ? (
      <ExerciseConceptView exercise={exercise} onAnswer={onAnswer} />
    ) : exercise.type === "MULTIPLE_CHOICE" ? (
      <ExerciseMcqView exercise={exercise} onAnswer={onAnswer} />
    ) : exercise.type === "FIND_THE_BUG" ? (
      <ExerciseFindBugView exercise={exercise} lineList={exerciseLineList(exercise.codeSnippet)} onAnswer={onAnswer} />
    ) : exercise.type === "DRAG_DROP" ? (
      <ExerciseDragDropView exercise={exercise} onAnswer={onAnswer} />
    ) : exercise.type === "CODE_FILL" ? (
      <ExerciseCodeFillView exercise={exercise} onAnswer={onAnswer} />
    ) : (
      <ExerciseTapTokenView exercise={exercise} onAnswer={onAnswer} />
    );
  return <View style={exerciseRendererStyles.root}>{node}</View>;
}
