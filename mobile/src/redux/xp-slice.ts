import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface XpState {
  level: number;
  xpTotal: number;
  xpMultiplierFactor: number;
  xpMultiplierEndsAt: number | null;
}

const initialState: XpState = {
  level: 1,
  xpTotal: 0,
  xpMultiplierFactor: 1,
  xpMultiplierEndsAt: null,
};

const xpSlice = createSlice({
  name: "xp",
  initialState,
  reducers: {
    addXp: (state, action: PayloadAction<number>) => {
      const now = Date.now();
      const active =
        state.xpMultiplierEndsAt !== null && state.xpMultiplierEndsAt > now && state.xpMultiplierFactor > 1;
      const amount = Math.round(action.payload * (active ? state.xpMultiplierFactor : 1));
      state.xpTotal += amount;
      state.level = Math.max(1, Math.floor(state.xpTotal / 250) + 1);
    },
    setXpMultiplier: (state, action: PayloadAction<{ factor: number; endsAt: number | null }>) => {
      state.xpMultiplierFactor = action.payload.factor;
      state.xpMultiplierEndsAt = action.payload.endsAt;
    },
    hydrateXp: (state, action: PayloadAction<Partial<XpState>>) => {
      Object.assign(state, action.payload);
    },
    resetXp: () => initialState,
  },
});

export const { addXp, setXpMultiplier, hydrateXp, resetXp } = xpSlice.actions;
export default xpSlice.reducer;
