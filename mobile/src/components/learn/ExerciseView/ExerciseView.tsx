import type { ReactNode } from "react";
import { View } from "react-native";
import type Exercise from "@/models/Exercise";
import { exerciseLineList } from "@/utils/formatHelpers";
import { mcqSubkind } from "@/utils/lessonExerciseState";
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
  const sharedProps = { exercise, accessToken: props.accessToken, onLessonExerciseComplete: props.onLessonExerciseComplete };
  let body: ReactNode;

  if (exercise.type === "PUZZLE") body = <EvCodeFill {...sharedProps} />;
  else {
    switch (mcqSubkind(exercise)) {
      case "concept":
        body = <EvConcept {...sharedProps} />;
        break;
      case "bugLine":
        body = <EvFindBug {...sharedProps} lineList={exerciseLineList(exercise.codeSnippet)} />;
        break;
      case "lineOrder":
        body = <EvLineOrdering {...sharedProps} />;
        break;
      default:
        body = <EvMcqTap {...sharedProps} />;
    }
  }

  return <View style={v.root}>{body}</View>;
}
