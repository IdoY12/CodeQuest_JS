import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DuelState {
  duelWins: number;
  duelLosses: number;
  lessonsCompleted: number;
}

const initialState: DuelState = {
  duelWins: 0,
  duelLosses: 0,
  lessonsCompleted: 0,
};

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    applyDuelResult: (state, action: PayloadAction<{ won: boolean }>) => {
      if (action.payload.won) state.duelWins += 1;
      else state.duelLosses += 1;
    },
    hydrateStats: (
      state,
      action: PayloadAction<{
        duelWins: number;
        duelLosses: number;
        lessonsCompleted: number;
      }>,
    ) => {
      const { duelWins, duelLosses, lessonsCompleted } = action.payload;
      state.duelWins = duelWins;
      state.duelLosses = duelLosses;
      state.lessonsCompleted = lessonsCompleted;
    },
    resetStats: () => initialState,
  },
});

export const { applyDuelResult, hydrateStats, resetStats } = duelSlice.actions;

export default duelSlice.reducer;
