import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PuzzleState {
  lastCodePuzzleSolvedDate: string | null;
  puzzleSolvedIdByDate: Record<string, string>;
}

const initialState: PuzzleState = {
  lastCodePuzzleSolvedDate: null,
  puzzleSolvedIdByDate: {},
};

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    markCodePuzzleSolved: (state, action: PayloadAction<{ dateKey: string; puzzleId: string }>) => {
      state.lastCodePuzzleSolvedDate = action.payload.dateKey;
      state.puzzleSolvedIdByDate[action.payload.dateKey] = action.payload.puzzleId;
    },
    hydratePuzzle: (state, action: PayloadAction<Partial<PuzzleState>>) => {
      const p = action.payload;
      if (p.lastCodePuzzleSolvedDate !== undefined) state.lastCodePuzzleSolvedDate = p.lastCodePuzzleSolvedDate;
      if (p.puzzleSolvedIdByDate !== undefined) state.puzzleSolvedIdByDate = p.puzzleSolvedIdByDate;
    },
  },
});

export const { markCodePuzzleSolved, hydratePuzzle } = puzzleSlice.actions;
export default puzzleSlice.reducer;
