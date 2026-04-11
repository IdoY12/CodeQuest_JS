import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DuelState {
  duelWins: number;
  duelLosses: number;
  duelRating: number;
  lessonsCompleted: number;
}

const initialState: DuelState = {
  duelWins: 0,
  duelLosses: 0,
  duelRating: 0,
  lessonsCompleted: 0,
};

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    applyDuelResult: (state, action: PayloadAction<{ won: boolean; ratingDelta: number }>) => {
      const { won, ratingDelta } = action.payload;
      if (won) state.duelWins += 1;
      else state.duelLosses += 1;
      state.duelRating = Math.max(0, state.duelRating + ratingDelta);
    },
    hydrateStats: (
      state,
      action: PayloadAction<{
        duelWins: number;
        duelLosses: number;
        duelRating: number;
        lessonsCompleted: number;
      }>,
    ) => {
      const { duelWins, duelLosses, duelRating, lessonsCompleted } = action.payload;
      state.duelWins = duelWins;
      state.duelLosses = duelLosses;
      state.duelRating = duelRating;
      state.lessonsCompleted = lessonsCompleted;
    },
    resetStats: () => initialState,
  },
});

export const { applyDuelResult, hydrateStats, resetStats } = duelSlice.actions;
export default duelSlice.reducer;
