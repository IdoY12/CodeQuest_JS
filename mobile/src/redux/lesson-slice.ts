import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LessonState {
  currentLessonId: string;
  lessonExerciseIndex: number;
  lessonAccuracy: number;
}

const initialState: LessonState = {
  currentLessonId: "b1-l1",
  lessonExerciseIndex: 0,
  lessonAccuracy: 0,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setCurrentLesson: (state, action: PayloadAction<string>) => {
      state.currentLessonId = action.payload;
      state.lessonExerciseIndex = 0;
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

export const { setCurrentLesson, setExerciseIndex, setLessonAccuracy, hydrateLesson, resetLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
