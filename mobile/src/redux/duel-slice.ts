import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DuelState {
  duelWins: number;
  duelLosses: number;
  duelDraws: number;
  duelRating: number;
  lessonsCompleted: number;
}

const initialState: DuelState = {
  duelWins: 0,
  duelLosses: 0,
  duelDraws: 0,
  duelRating: 0,
  lessonsCompleted: 0,
};

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    applyDuelResult: (state, action: PayloadAction<{ won: boolean; draw?: boolean; ratingDelta: number }>) => {
      const { won, draw, ratingDelta } = action.payload;
      if (won) state.duelWins += 1;
      if (!won && !draw) state.duelLosses += 1;
      if (draw) state.duelDraws += 1;
      state.duelRating = Math.max(0, state.duelRating + ratingDelta);
    },
    incrementLessonsCompleted: (state) => {
      state.lessonsCompleted += 1;
    },
    hydrateStats: (
      state,
      action: PayloadAction<{
        duelWins: number;
        duelLosses: number;
        duelDraws: number;
        duelRating: number;
        lessonsCompleted: number;
      }>,
    ) => {
      Object.assign(state, action.payload);
    },
    resetStats: () => initialState,
  },
});

export const { applyDuelResult, incrementLessonsCompleted, hydrateStats, resetStats } = duelSlice.actions;
export default duelSlice.reducer;
