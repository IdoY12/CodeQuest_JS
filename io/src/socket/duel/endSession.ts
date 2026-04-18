/**
 * Finalizes a duel: persist session, grant summary XP sync for clients, then notify clients.
 *
 * Responsibility: write DB, emit duel_end, clear memory session, store rematch entry.
 * Layer: io duel session
 * Consumers: roundTimeoutFlow, submitAnswer
 */

import { prisma, getProgressForActiveUser } from "@project/db";
import { sessions, rematchEntries } from "./state.js";
import type { DuelNamespace, SessionState } from "./types.js";

const REMATCH_EXPIRY_MS = 60_000;

export async function endSession(io: DuelNamespace, session: SessionState) {
  const winnerIsP1 = session.score.player1 >= session.score.player2;
  const winner = winnerIsP1 ? session.player1 : session.player2;

  await prisma.duelSession
    .create({
      data: {
        player1Id: session.player1.userId,
        player2Id: session.player2.userId,
        winnerId: winner.userId,
        player1Score: session.score.player1,
        player2Score: session.score.player2,
        roundsPlayed: session.round,
        roundReplay: session.roundReplay,
        endedAt: new Date(),
      },
    })
    .catch(() => null);

  sessions.delete(session.sessionId);

  const isSolo = session.player1.userId === session.player2.userId;
  rematchEntries.set(session.sessionId, {
    player1: session.player1,
    player2: session.player2,
    isSolo,
    requests: new Map(),
    io,
    timer: setTimeout(() => rematchEntries.delete(session.sessionId), REMATCH_EXPIRY_MS),
  });

  const [streakP1, streakP2] = await Promise.all([
    getProgressForActiveUser(prisma, session.player1.userId).then((p) => p?.streakCurrent ?? 0),
    isSolo
      ? Promise.resolve(0)
      : getProgressForActiveUser(prisma, session.player2.userId).then((p) => p?.streakCurrent ?? 0),
  ]);
  const streakP2Out = isSolo ? streakP1 : streakP2;

  const base = {
    winner_user_id: winner.userId,
    round_replay: session.roundReplay,
  };
  const payloadP1 = {
    ...base,
    my_score: session.score.player1,
    opp_score: session.score.player2,
    xp_earned: session.xpGrantedP1,
    streak_current: streakP1,
  };
  const payloadP2 = {
    ...base,
    my_score: session.score.player2,
    opp_score: session.score.player1,
    xp_earned: session.xpGrantedP2,
    streak_current: streakP2Out,
  };

  if (isSolo) {
    io.to(session.roomId).emit("duel_end", payloadP1);
    return;
  }

  io.to(session.player1.socketId).emit("duel_end", payloadP1);
  io.to(session.player2.socketId).emit("duel_end", payloadP2);
}
