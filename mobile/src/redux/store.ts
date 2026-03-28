import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./session-slice";
import profileReducer from "./profile-slice";
import xpReducer from "./xp-slice";
import streakReducer from "./streak-slice";
import lessonReducer from "./lesson-slice";
import duelReducer from "./duel-slice";
import puzzleReducer from "./puzzle-slice";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    profile: profileReducer,
    xp: xpReducer,
    streak: streakReducer,
    lesson: lessonReducer,
    duel: duelReducer,
    puzzle: puzzleReducer,
  },
});

export default store;
export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
