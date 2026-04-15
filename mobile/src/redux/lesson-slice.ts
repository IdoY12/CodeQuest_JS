import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type Exercise from "@/models/Exercise";

/** Stable key used to store/retrieve progress for one level × block combination. */
export const blockProgressKey = (level: string, blockIndex: number) => `${level}_block${blockIndex}`;

interface LessonState {
  currentExperienceLevel: string;
  lessonExerciseIndex: number;
  /** Maps blockProgressKey → last question index the user reached (0-based). */
  blockProgress: Record<string, number>;
  /** Session cache: full curriculum list per level (avoids repeat GET /learning/exercises). */
  exercisesByExperienceLevel: Partial<Record<string, Exercise[]>>;
}

const initialState: LessonState = {
  currentExperienceLevel: "JUNIOR",
  lessonExerciseIndex: 0,
  blockProgress: {},
  exercisesByExperienceLevel: {},
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setCurrentExperienceLevel: (state, action: PayloadAction<string>) => {
      state.currentExperienceLevel = action.payload;
    },
    setExerciseIndex: (state, action: PayloadAction<number>) => {
      state.lessonExerciseIndex = action.payload;
    },
    saveBlockProgress: (state, action: PayloadAction<{ level: string; blockIndex: number; exerciseIndex: number }>) => {
      const { level, blockIndex, exerciseIndex } = action.payload;
      state.blockProgress[blockProgressKey(level, blockIndex)] = exerciseIndex;
    },
    resetBlockProgress: (state, action: PayloadAction<{ level: string; blockIndex: number }>) => {
      const { level, blockIndex } = action.payload;
      delete state.blockProgress[blockProgressKey(level, blockIndex)];
    },
    setCachedExercisesForLevel: (state, action: PayloadAction<{ experienceLevel: string; exercises: Exercise[] }>) => {
      state.exercisesByExperienceLevel[action.payload.experienceLevel] = action.payload.exercises;
    },
    hydrateLesson: (state, action: PayloadAction<Partial<LessonState>>) => {
      Object.assign(state, action.payload);
    },
    resetLesson: () => initialState,
  },
});

export const {
  setCurrentExperienceLevel,
  setExerciseIndex,
  saveBlockProgress,
  resetBlockProgress,
  setCachedExercisesForLevel,
  hydrateLesson,
  resetLesson,
} = lessonSlice.actions;

export default lessonSlice.reducer;
