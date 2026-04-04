import type { Socket } from "socket.io-client";

export interface DuelRound {
  roundNumber: number;
  prompt: string;
  codeSnippet: string;
  options: string[];
  correctAnswer?: string;
  type: "MULTIPLE_CHOICE" | "FIND_THE_BUG" | "TAP_TOKEN" | "CODE_FILL";
}

export interface DuelReplayRow {
  roundNumber: number;
  winnerUserId: string | null;
  correctAnswer: string;
  player1TimeMs: number;
  player2TimeMs: number;
}

export interface DuelState {
  playersOnline: number;
  sessionId: string | null;
  opponent: { username: string; rating: number } | null;
  round: DuelRound | null;
  score: { me: number; opp: number };
  duelEnd:
    | { won: boolean; ratingDelta: number; xpEarned: number; roundReplay: DuelReplayRow[] }
    | null;
}

export const duelRefs = {
  socket: null as Socket | null,
  lastAuthTokenKey: "__init__",
  userId: null as string | null,
  state: {
    playersOnline: 0,
    sessionId: null,
    opponent: null,
    round: null,
    score: { me: 0, opp: 0 },
    duelEnd: null,
  } as DuelState,
  listeners: new Set<(state: DuelState) => void>(),
};

export function publishDuel(next: Partial<DuelState>) {
  duelRefs.state = { ...duelRefs.state, ...next };
  duelRefs.listeners.forEach((l) => l(duelRefs.state));
}

export function normalizeDuelReplayEntry(entry: unknown): DuelReplayRow {
  const e = entry as {
    roundNumber?: number;
    round_number?: number;
    winnerUserId?: string;
    winner_user_id?: string | null;
    correctAnswer?: string;
    correct_answer?: string;
    player1TimeMs?: number;
    player1_ms?: number;
    player2TimeMs?: number;
    player2_ms?: number;
  };
  return {
    roundNumber: Number(e.roundNumber ?? e.round_number ?? 0),
    winnerUserId: typeof e.winnerUserId === "string" ? e.winnerUserId : e.winner_user_id ?? null,
    correctAnswer: String(e.correctAnswer ?? e.correct_answer ?? ""),
    player1TimeMs: Number(e.player1TimeMs ?? e.player1_ms ?? 0),
    player2TimeMs: Number(e.player2TimeMs ?? e.player2_ms ?? 0),
  };
}
