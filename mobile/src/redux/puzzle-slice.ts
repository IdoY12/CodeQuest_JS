import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PuzzleState {
  lastDailyPuzzleSolvedDate: string | null;
  puzzleSolvedIdByDate: Record<string, string>;
}

const initialState: PuzzleState = {
  lastDailyPuzzleSolvedDate: null,
  puzzleSolvedIdByDate: {},
};

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    markDailyPuzzleSolved: (state, action: PayloadAction<{ dateKey: string; puzzleId: string }>) => {
      state.lastDailyPuzzleSolvedDate = action.payload.dateKey;
      state.puzzleSolvedIdByDate[action.payload.dateKey] = action.payload.puzzleId;
    },
    hydratePuzzle: (state, action: PayloadAction<Partial<PuzzleState>>) => {
      const p = action.payload;
      if (p.lastDailyPuzzleSolvedDate !== undefined) state.lastDailyPuzzleSolvedDate = p.lastDailyPuzzleSolvedDate;
      if (p.puzzleSolvedIdByDate !== undefined) state.puzzleSolvedIdByDate = p.puzzleSolvedIdByDate;
    },
  },
});

export const { markDailyPuzzleSolved, hydratePuzzle } = puzzleSlice.actions;
export default puzzleSlice.reducer;
