import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LessonState {
  currentExperienceLevel: string;
  lessonExerciseIndex: number;
  lessonAccuracy: number;
}

const initialState: LessonState = {
  currentExperienceLevel: "JUNIOR",
  lessonExerciseIndex: 0,
  lessonAccuracy: 0,
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
    setLessonAccuracy: (state, action: PayloadAction<number>) => {
      state.lessonAccuracy = action.payload;
    },
    hydrateLesson: (state, action: PayloadAction<Partial<LessonState>>) => {
      Object.assign(state, action.payload);
    },
    resetLesson: () => initialState,
  },
});

export const { setCurrentExperienceLevel, setExerciseIndex, setLessonAccuracy, hydrateLesson, resetLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
