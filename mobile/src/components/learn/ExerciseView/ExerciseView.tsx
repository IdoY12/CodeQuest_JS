import type { ReactNode } from "react";
import { View } from "react-native";
import type Exercise from "@/models/Exercise";
import { exerciseLineList } from "@/utils/formatHelpers";
import { mcqSubkind } from "@/utils/lessonExerciseState";
import type { LessonExerciseCompletionContext } from "@/types/lessonExerciseCompletion.types";
import { ExerciseConceptConfirm } from "./ExerciseViewConceptConfirm";
import { ExerciseFindBugLine } from "./ExerciseViewFindBugLine";
import { ExerciseCodePuzzleFill } from "./ExerciseViewCodePuzzleFill";
import { ExerciseMcqTap } from "./ExerciseViewMcqTap";
import { ExerciseLineOrdering } from "./ExerciseViewLineOrdering";
import { exerciseViewStyles } from "./ExerciseView.styles";

type ExerciseViewProps = {
  exercise: Exercise;
  accessToken: string | null;
  onLessonExerciseComplete: (answer: string, context: LessonExerciseCompletionContext) => void;
};

export function ExerciseView(props: ExerciseViewProps) {
  const { exercise } = props;
  const sharedProps = { exercise, accessToken: props.accessToken, onLessonExerciseComplete: props.onLessonExerciseComplete };
  let body: ReactNode;

  if (exercise.type === "PUZZLE") body = <ExerciseCodePuzzleFill {...sharedProps} />;
  else {
    switch (mcqSubkind(exercise)) {
      case "concept":
        body = <ExerciseConceptConfirm {...sharedProps} />;
        break;
      case "bugLine":
        body = <ExerciseFindBugLine {...sharedProps} lineList={exerciseLineList(exercise.codeSnippet)} />;
        break;
      case "lineOrder":
        body = <ExerciseLineOrdering {...sharedProps} />;
        break;
      default:
        body = <ExerciseMcqTap {...sharedProps} />;
    }
  }

  return <View style={exerciseViewStyles.root}>{body}</View>;
}
