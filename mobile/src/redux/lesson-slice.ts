import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LessonState {
  currentLessonId: string;
  lessonExerciseIndex: number;
  lessonAccuracy: number;
  personalizedBlocksCompletedByLevel: Partial<Record<"JUNIOR" | "MID" | "SENIOR", number[]>>;
  // personalizedBlocksCompletedByLevel: {
  //   "JUNIOR": [1, 2, 3],
  //   "MID": [1],
  //   "SENIOR": []
  // }
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
    //  Theory: This function manages a "Many-to-Many" relationship map between difficulty levels 
    // and their respective completed content blocks, ensuring data integrity and uniqueness.
    markPersonalizedBlockCompleted: (
      state,
      // Destructuring the payload to get the specific level (difficulty) and the unique block identifier
      action: PayloadAction<{ level: "JUNIOR" | "MID" | "SENIOR"; blockNumber: number }>,
    ) => {
      // Extracting level and blockNumber for clean access throughout the function
      const { level, blockNumber } = action.payload;
      // DATA RETRIEVAL THEORY: "Nullish Coalescing"
      // We attempt to fetch the existing array of completed blocks for this specific level.
      // If this level has no entries yet (undefined), we initialize it with an empty array [] to avoid crashes.
      const completedBlocksForLevel = state.personalizedBlocksCompletedByLevel[level] ?? [];
      // IDEMPOTENCY THEORY: 
      // In state management, we want to ensure that performing the same action twice doesn't change the state.
      // We check if the blockNumber is already recorded to prevent duplicate entries in our history.
     if (!completedBlocksForLevel.includes(blockNumber)) {
        // IMMUTABILITY & UPDATING:
        // 1. Spread Operator (...): We create a new array containing all previous blocks plus the new one.
        // 2. Numeric Sort: We apply (a, b) => a - b to ensure the blocks stay in chronological/numerical order.
        // 3. Assignment: We save the new sorted array back into the state under the specific level key.
        state.personalizedBlocksCompletedByLevel[level] = [...completedBlocksForLevel, blockNumber].sort((a, b) => a - b);
      }
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
