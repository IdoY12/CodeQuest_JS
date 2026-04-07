import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LessonState {
  currentLessonId: string;
  lessonExerciseIndex: number;
  lessonAccuracy: number;
  personalizedBlocksCompletedByLevel: Partial<Record<"JUNIOR" | "MID" | "SENIOR", number[]>>;
}

const initialState: LessonState = {
  currentLessonId: "b1-l1",
  lessonExerciseIndex: 0,
  lessonAccuracy: 0,
  personalizedBlocksCompletedByLevel: {},
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
    markPersonalizedBlockCompleted: (
      state,
      action: PayloadAction<{ level: "JUNIOR" | "MID" | "SENIOR"; blockNumber: number }>,
    ) => {
      const { level, blockNumber } = action.payload;
      const existing = state.personalizedBlocksCompletedByLevel[level] ?? [];
      if (!existing.includes(blockNumber)) state.personalizedBlocksCompletedByLevel[level] = [...existing, blockNumber].sort();
    },
    hydrateLesson: (state, action: PayloadAction<Partial<LessonState>>) => {
      Object.assign(state, action.payload);
    },
    resetLesson: () => initialState,
  },
});

export const { setCurrentLesson, setExerciseIndex, setLessonAccuracy, markPersonalizedBlockCompleted, hydrateLesson, resetLesson } =
  lessonSlice.actions;
export default lessonSlice.reducer;
