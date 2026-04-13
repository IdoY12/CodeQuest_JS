import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StreakState {
  streakCurrent: number;
  streakDays: boolean[];
}

const initialState: StreakState = {
  streakCurrent: 0,
  streakDays: [false, false, false, false, false, false, false],
};

const streakSlice = createSlice({
  name: "streak",
  initialState,
  reducers: {
    hydrateStreak: (state, action: PayloadAction<Partial<StreakState>>) => {
      Object.assign(state, action.payload);
    },
    resetStreak: () => initialState,
  },
});

export const { hydrateStreak, resetStreak } = streakSlice.actions;
export default streakSlice.reducer;
