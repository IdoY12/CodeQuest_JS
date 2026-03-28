import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MainTabParamList } from "./mainTab.types";

export type HomeStackParamList = {
  HomeMain: undefined;
  DailyPuzzle: undefined;
};

export type HomeMainScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "HomeMain">,
  BottomTabScreenProps<MainTabParamList>
>;

export type DailyPuzzleScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "DailyPuzzle">,
  BottomTabScreenProps<MainTabParamList>
>;
