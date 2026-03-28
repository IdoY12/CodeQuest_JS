import { useAppSelector } from "@/redux/hooks";
import type { LessonScreenNavigation, LessonScreenProps } from "../types/learnNavigation.types";
import { useLessonLoad } from "./useLessonLoad";
import { useLessonOnAnswer } from "./useLessonOnAnswer";
import { useLessonPracticeTimer } from "./useLessonPracticeTimer";

export function useLessonScreenController(
  navigation: LessonScreenNavigation,
  route: LessonScreenProps["route"],
) {
  const lessonId = route.params.lessonId;
  const lessonTitle = route.params.lessonTitle;
  const personalizedLevel = route.params.personalizedLevel;
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const load = useLessonLoad(lessonId, personalizedLevel);
  const exercise = load.exercises[load.exerciseIndex];
  useLessonPracticeTimer(accessToken, exercise, load.loading);
  const onAnswer = useLessonOnAnswer(
    navigation,
    load.exercises,
    load.exerciseIndex,
    load.correctCount,
    load.attemptedCount,
    load.setExerciseIndex,
    load.setCorrectCount,
    load.setAttemptedCount,
    lessonTitle,
    personalizedLevel,
  );
  const progress = load.exercises.length > 0 ? ((load.exerciseIndex + 1) / load.exercises.length) * 100 : 0;
  return { ...load, exercise, progress, onAnswer, lessonTitle };
}
