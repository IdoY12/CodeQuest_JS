import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Experience } from "@/redux/profile-slice";

export type LearnStackParamList = {
  LearnRoadmap: undefined;
  Lesson: {
    lessonId: string;
    lessonTitle: string;
    personalizedLevel?: Experience;
  };
  LessonResults: { accuracy: number; lessonTitle: string; lessonId: string; personalizedLevel?: Experience };
};

export type LearnRoadmapNavigation = NativeStackNavigationProp<LearnStackParamList, "LearnRoadmap">;

export type LessonScreenNavigation = NativeStackNavigationProp<LearnStackParamList, "Lesson">;

export type LessonScreenProps = NativeStackScreenProps<LearnStackParamList, "Lesson">;

export type LessonResultsNavigation = NativeStackNavigationProp<LearnStackParamList, "LessonResults">;
