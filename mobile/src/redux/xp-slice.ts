import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface XpState {
  level: number;
  xpTotal: number;
}

const initialState: XpState = {
  level: 1,
  xpTotal: 0,
};

const xpSlice = createSlice({
  name: "xp",
  initialState,
  reducers: {
    addXp: (state, action: PayloadAction<number>) => {
      state.xpTotal += action.payload;
      state.level = Math.max(1, Math.floor(state.xpTotal / 250) + 1);
    },
    hydrateXp: (state, action: PayloadAction<Partial<XpState>>) => {
      Object.assign(state, action.payload);
    },
    resetXp: () => initialState,
  },
});

export const { addXp, hydrateXp, resetXp } = xpSlice.actions;
export default xpSlice.reducer;
