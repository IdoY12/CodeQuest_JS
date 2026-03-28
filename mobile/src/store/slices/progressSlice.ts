import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProgressState {
  level: number;
  xpTotal: number;
  streakCurrent: number;
  streakDays: boolean[];
  lessonsCompleted: number;
  duelWins: number;
  duelLosses: number;
  duelDraws: number;
  duelRating: number;
  streakShieldAvailable: boolean;
  lastDailyPuzzleSolvedDate: string | null;
  puzzleSolvedIdByDate: Record<string, string>;
  xpMultiplierFactor: number;
  xpMultiplierEndsAt: number | null;
}

const initialState: ProgressState = {
  level: 1,
  xpTotal: 0,
  streakCurrent: 0,
  streakDays: [false, false, false, false, false, false, false],
  lessonsCompleted: 0,
  duelWins: 0,
  duelLosses: 0,
  duelDraws: 0,
  duelRating: 0,
  streakShieldAvailable: false,
  lastDailyPuzzleSolvedDate: null,
  puzzleSolvedIdByDate: {},
  xpMultiplierFactor: 1,
  xpMultiplierEndsAt: null,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    addXp(state, action: PayloadAction<number>) {
      const now = Date.now();
      const multiplierActive =
        state.xpMultiplierEndsAt !== null && state.xpMultiplierEndsAt > now && state.xpMultiplierFactor > 1;
      const appliedAmount = Math.round(action.payload * (multiplierActive ? state.xpMultiplierFactor : 1));
      state.xpTotal += appliedAmount;
      state.level = Math.max(1, Math.floor(state.xpTotal / 250) + 1);
    },
    setProgressSnapshot(
      state,
      action: PayloadAction<{
        xpTotal: number;
        level: number;
        streakCurrent: number;
        streakDays: boolean[];
        lessonsCompleted: number;
        duelWins: number;
        duelLosses: number;
        duelDraws: number;
        duelRating: number;
        streakShieldAvailable: boolean;
      }>,
    ) {
      Object.assign(state, action.payload);
    },
    markDailyPuzzleSolved(state, action: PayloadAction<{ dateKey: string; puzzleId: string }>) {
      state.lastDailyPuzzleSolvedDate = action.payload.dateKey;
      state.puzzleSolvedIdByDate[action.payload.dateKey] = action.payload.puzzleId;
    },
    setXpMultiplier(state, action: PayloadAction<{ factor: number; endsAt: number | null }>) {
      state.xpMultiplierFactor = action.payload.factor;
      state.xpMultiplierEndsAt = action.payload.endsAt;
    },
    incrementLessonsCompleted(state) {
      state.lessonsCompleted += 1;
    },
    applyDuelResult(state, action: PayloadAction<{ won: boolean; draw?: boolean; ratingDelta: number }>) {
      if (action.payload.won) state.duelWins += 1;
      if (!action.payload.won && !action.payload.draw) state.duelLosses += 1;
      if (action.payload.draw) state.duelDraws += 1;
      state.duelRating = Math.max(0, state.duelRating + action.payload.ratingDelta);
    },
    hydrateProgress(state, action: PayloadAction<Partial<ProgressState>>) {
      Object.assign(state, action.payload);
    },
    resetProgress() {
      return initialState;
    },
  },
});

export const progressActions = progressSlice.actions;
export const progressReducer = progressSlice.reducer;
