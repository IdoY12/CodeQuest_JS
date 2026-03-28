import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PersonalizationLevel } from "../data/personalizedExercisePool";

export type LearnStackParamList = {
  LearnRoadmap: undefined;
  Lesson: {
    lessonId: string;
    lessonTitle: string;
    personalizedLevel?: PersonalizationLevel;
  };
  LessonResults: { accuracy: number; lessonTitle: string };
};

export type LearnRoadmapNavigation = NativeStackNavigationProp<LearnStackParamList, "LearnRoadmap">;

export type LessonScreenNavigation = NativeStackNavigationProp<LearnStackParamList, "Lesson">;

export type LessonScreenProps = NativeStackScreenProps<LearnStackParamList, "Lesson">;

export type LessonResultsNavigation = NativeStackNavigationProp<LearnStackParamList, "LessonResults">;
