import type { Server } from "socket.io";

export interface QueueEntry {
  socketId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  experienceLevel: string;
  joinedAt: number;
}

export interface SessionState {
  sessionId: string;
  roomId: string;
  player1: QueueEntry;
  player2: QueueEntry;
  score: { player1: number; player2: number };
  round: number;
  readyUserIds: Set<string>;
  currentQuestionId: string | null;
  answered: boolean;
  roundTimeout: ReturnType<typeof setTimeout> | null;
  roundNonce: number;
  roundReplay: Array<{
    roundNumber: number;
    winnerUserId: string | null;
    correctAnswer: string;
    player1TimeMs: number;
    player2TimeMs: number;
  }>;
  /** Client local YYYY-MM-DD for streak when granting duel XP. */
  player1StreakLocalDate: string | null;
  player2StreakLocalDate: string | null;
  /** XP persisted during this duel for each slot (for duel_end client sync). */
  xpGrantedP1: number;
  xpGrantedP2: number;
}

export type DuelNamespace = ReturnType<Server["of"]>;
