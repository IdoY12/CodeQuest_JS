import type { DuelNamespace, QueueEntry, SessionState } from "./types.js";

export const queue: QueueEntry[] = [];

export const sessions = new Map<string, SessionState>();

export function makeSession(sessionId: string, roomId: string, p1: QueueEntry, p2: QueueEntry): SessionState {
  return {
    sessionId, roomId, player1: p1, player2: p2,
    score: { player1: 0, player2: 0 }, round: 0,
    readyUserIds: new Set<string>(),
    currentQuestionId: null, currentQuestion: null, answered: false,
    player1Attempts: 0, player2Attempts: 0, roundNonce: 0, roundReplay: [],
    player1StreakLocalDate: null, player2StreakLocalDate: null,
    xpGrantedP1: 0, xpGrantedP2: 0,
  };
}

/** When still alone after {@link SOLO_MATCH_WAIT_MS}, start a solo session (see queue.ts). */
export const soloMatchTimers = new Map<string, ReturnType<typeof setTimeout>>();

export interface RematchEntry {
  player1: QueueEntry;
  player2: QueueEntry;
  isSolo: boolean;
  /** userId → current socketId of the requesting player. */
  requests: Map<string, string>;
  timer: ReturnType<typeof setTimeout> | null;
  io: DuelNamespace;
}

/** Keyed by the original sessionId. Expires after REMATCH_EXPIRY_MS. */
export const rematchEntries = new Map<string, RematchEntry>();
