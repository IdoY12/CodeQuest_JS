import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DuelRound, DuelReplayRow } from "@/utils/duelSocketModels";

type DuelEnd = {
  won: boolean; xpEarned: number; streakCurrent?: number;
  roundReplay: DuelReplayRow[]; finalScore: string; opponentDisconnected?: boolean;
};
interface DuelState {
  playersOnline: number; sessionId: string | null;
  opponent: { username: string; avatarUrl: string | null } | null;
  round: DuelRound | null; score: { me: number; opp: number }; wrongAnswerCount: number;
  duelEnd: DuelEnd | null; rematchStatus: "opponent_left" | null;
  lastCorrectAnswer: string | null; queueRejected: string | null;
}
const initialState: DuelState = {
  playersOnline: 0, sessionId: null, opponent: null, round: null,
  score: { me: 0, opp: 0 }, wrongAnswerCount: 0, duelEnd: null,
  rematchStatus: null, lastCorrectAnswer: null, queueRejected: null,
};
const duelLiveSlice = createSlice({
  name: "duelLive",
  initialState,
  reducers: {
    queueRejected: (s, a: PayloadAction<string>) => { s.queueRejected = a.payload; },
    playersOnlineSet: (s, a: PayloadAction<number>) => { s.playersOnline = a.payload; },
    matchFound: (s, { payload: p }: PayloadAction<{ sessionId: string | null; opponent: DuelState["opponent"] }>) => {
      s.sessionId = p.sessionId; s.opponent = p.opponent; s.round = null;
      s.score = { me: 0, opp: 0 }; s.wrongAnswerCount = 0; s.duelEnd = null;
      s.rematchStatus = null; s.lastCorrectAnswer = null; s.queueRejected = null;
    },
    roundStarted: (s, { payload: p }: PayloadAction<{ round: DuelRound }>) => {
      s.round = p.round; s.lastCorrectAnswer = null; s.wrongAnswerCount = 0;
    },
    roundResultReceived: (s, { payload: p }: PayloadAction<{ score: DuelState["score"]; lastCorrectAnswer: string }>) => {
      s.score = p.score; s.lastCorrectAnswer = p.lastCorrectAnswer;
    },
    duelEnded: (s, { payload: p }: PayloadAction<{ duelEnd: DuelEnd }>) => { s.duelEnd = p.duelEnd; },
    opponentDisconnected: (s, { payload: p }: PayloadAction<{ xpEarned: number }>) => {
      s.duelEnd = { won: true, xpEarned: p.xpEarned, roundReplay: [], finalScore: "W-0", opponentDisconnected: true };
    },
    wrongAnswerIncremented: (s) => { s.wrongAnswerCount += 1; },
    rematchDeclined: (s) => { s.rematchStatus = "opponent_left"; },
    duelReset: () => initialState,
  },
});
export const {
  queueRejected, playersOnlineSet, matchFound, roundStarted, roundResultReceived,
  duelEnded, opponentDisconnected, wrongAnswerIncremented, rematchDeclined, duelReset,
} = duelLiveSlice.actions;
export default duelLiveSlice.reducer;
