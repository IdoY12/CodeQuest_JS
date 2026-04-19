import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Puzzle } from "@/services/auth-aware/PuzzleService";

interface PuzzleState {
  allPuzzles: Puzzle[] | null;
}

const initialState: PuzzleState = { allPuzzles: null };

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    setCachedAllPuzzles: (state, action: PayloadAction<Puzzle[]>) => {
      state.allPuzzles = action.payload;
    },
    hydratePuzzle: (state, action: PayloadAction<Partial<PuzzleState>>) => {
      Object.assign(state, action.payload);
    },
    resetPuzzle: () => initialState,
  },
});

export const { setCachedAllPuzzles, hydratePuzzle, resetPuzzle } = puzzleSlice.actions;
export default puzzleSlice.reducer;
