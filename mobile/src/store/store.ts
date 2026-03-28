import { configureStore } from "@reduxjs/toolkit";
import { sessionReducer } from "./slices/sessionSlice";
import { progressReducer } from "./slices/progressSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
