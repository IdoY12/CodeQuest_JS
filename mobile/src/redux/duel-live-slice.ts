import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DuelRound, DuelReplayRow } from "@/utils/duelSocketModels";

interface DuelState {
  playersOnline: number;
  sessionId: string | null;
  opponent: { username: string; avatarUrl: string | null } | null;
  round: DuelRound | null;
  score: { me: number; opp: number };
  duelEnd: {
    won: boolean;
    xpEarned: number;
    streakCurrent?: number;
    roundReplay: DuelReplayRow[];
    finalScore: string;
    opponentDisconnected?: boolean;
  } | null;
  rematchStatus: "opponent_left" | null;
  lastCorrectAnswer: string | null;
  queueRejected: string | null;
}

const initialState: DuelState = {
  playersOnline: 0,
  sessionId: null,
  opponent: null,
  round: null,
  score: { me: 0, opp: 0 },
  duelEnd: null,
  rematchStatus: null,
  lastCorrectAnswer: null,
  queueRejected: null,
};

const duelLiveSlice = createSlice({
  name: "duelLive",
  initialState,
  reducers: {
    queueRejected: (state, action: PayloadAction<string>) => {
      state.queueRejected = action.payload;
    },
    playersOnlineSet: (state, action: PayloadAction<number>) => {
      state.playersOnline = action.payload;
    },
    matchFound: (
      state,
      action: PayloadAction<{ sessionId: string | null; opponent: DuelState["opponent"] }>,
    ) => {
      state.sessionId = action.payload.sessionId;
      state.opponent = action.payload.opponent;
      state.round = null;
      state.score = { me: 0, opp: 0 };
      state.duelEnd = null;
      state.rematchStatus = null;
      state.lastCorrectAnswer = null;
      state.queueRejected = null;
    },
    roundStarted: (state, action: PayloadAction<{ round: DuelRound }>) => {
      state.round = action.payload.round;
      state.lastCorrectAnswer = null;
    },
    roundResultReceived: (
      state,
      action: PayloadAction<{ score: DuelState["score"]; lastCorrectAnswer: string }>,
    ) => {
      state.score = action.payload.score;
      state.lastCorrectAnswer = action.payload.lastCorrectAnswer;
    },
    duelEnded: (state, action: PayloadAction<{ duelEnd: DuelState["duelEnd"] }>) => {
      state.duelEnd = action.payload.duelEnd;
    },
    opponentDisconnected: (state, action: PayloadAction<{ xpEarned: number }>) => {
      state.duelEnd = {
        won: true,
        xpEarned: action.payload.xpEarned,
        roundReplay: [],
        finalScore: "W-0",
        opponentDisconnected: true,
      };
    },
    rematchDeclined: (state) => {
      state.rematchStatus = "opponent_left";
    },
    duelReset: () => initialState,
  },
});

export const {
  queueRejected,
  playersOnlineSet,
  matchFound,
  roundStarted,
  roundResultReceived,
  duelEnded,
  opponentDisconnected,
  rematchDeclined,
  duelReset,
} = duelLiveSlice.actions;
export default duelLiveSlice.reducer;
