import type { ReactNode } from "react";
import { View } from "react-native";
import type Exercise from "@/models/Exercise";
import { exerciseLineList } from "@/utils/formatHelpers";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { EvConcept } from "./ExerciseView.partA";
import { EvFindBug } from "./ExerciseView.partBC";
import { EvCodeFill } from "./ExerciseView.partCode";
import { EvMcqTap } from "./ExerciseView.partMcq";
import { EvLineOrdering } from "./ExerciseView.partD";
import { v } from "./ExerciseView.styles";

export type ExerciseViewProps = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseView(props: ExerciseViewProps) {
  const { exercise } = props;
  const exerciseType = exercise.type;
  const sharedProps = { exercise, accessToken: props.accessToken, onLessonExerciseComplete: props.onLessonExerciseComplete };
  let body: ReactNode;

  if (exerciseType === "CONCEPT_CARD") body = <EvConcept {...sharedProps} />;
  else if (exerciseType === "MULTIPLE_CHOICE") body = <EvMcqTap variant="mcq" {...sharedProps} />;
  else if (exerciseType === "FIND_THE_BUG") body = <EvFindBug {...sharedProps} lineList={exerciseLineList(exercise.codeSnippet)} />;
  else if (exerciseType === "DRAG_DROP") body = <EvLineOrdering {...sharedProps} />;
  else if (exerciseType === "CODE_FILL") body = <EvCodeFill {...sharedProps} />;
  else body = <EvMcqTap variant="tap_token" {...sharedProps} />;

  return <View style={v.root}>{body}</View>;
}
