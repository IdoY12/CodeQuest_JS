import type { ReactNode } from "react";
import { View } from "react-native";
import type Exercise from "@/models/Exercise";
import { exerciseLineList } from "@/utils/formatHelpers";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { EvConcept } from "./ExerciseView.partA";
import { EvFindBug } from "./ExerciseView.partBC";
import { EvCodeFill } from "./ExerciseView.partCode";
import { EvMcqTap } from "./ExerciseView.partMcq";
import { EvDragDrop } from "./ExerciseView.partD";
import { v } from "./ExerciseView.styles";

export type ExerciseViewProps = {
  exercise: Exercise;
  lessonSource: "personalized" | "curriculum";
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseView(p: ExerciseViewProps) {
  const { exercise } = p;
  const t = exercise.type;
  const s = { exercise, lessonSource: p.lessonSource, accessToken: p.accessToken, onLessonExerciseComplete: p.onLessonExerciseComplete };
  let body: ReactNode;
  if (t === "CONCEPT_CARD") body = <EvConcept {...s} />;
  else if (t === "MULTIPLE_CHOICE") body = <EvMcqTap variant="mcq" {...s} />;
  else if (t === "FIND_THE_BUG") body = <EvFindBug {...s} lineList={exerciseLineList(exercise.codeSnippet)} />;
  else if (t === "DRAG_DROP") body = <EvDragDrop {...s} />;
  else if (t === "CODE_FILL") body = <EvCodeFill {...s} />;
  else body = <EvMcqTap variant="tap_token" {...s} />;
  return <View style={v.root}>{body}</View>;
}
