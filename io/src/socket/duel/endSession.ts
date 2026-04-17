/**
 * Finalizes a duel: persist session, grant summary XP sync for clients, then notify clients.
 *
 * Responsibility: teardown timers, write DB, emit duel_end, clear memory session.
 * Layer: io duel session
 * Consumers: roundTimeoutFlow, submitAnswer
 */

import { prisma, getProgressForActiveUser } from "@project/db";
import { sessions } from "./state.js";
import type { DuelNamespace, SessionState } from "./types.js";

export async function endSession(io: DuelNamespace, session: SessionState) {
  if (session.roundTimeout) {
    clearTimeout(session.roundTimeout);
    session.roundTimeout = null;
  }

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

  const solo = session.player1.userId === session.player2.userId;
  const [streakP1, streakP2] = await Promise.all([
    getProgressForActiveUser(prisma, session.player1.userId).then((p) => p?.streakCurrent ?? 0),
    solo
      ? Promise.resolve(0)
      : getProgressForActiveUser(prisma, session.player2.userId).then((p) => p?.streakCurrent ?? 0),
  ]);
  const streakP2Out = solo ? streakP1 : streakP2;

  const payloadP1 = {
    winner_user_id: winner.userId,
    final_scores: { player1: session.score.player1, player2: session.score.player2 },
    xp_earned: session.xpGrantedP1,
    streak_current: streakP1,
    round_replay: session.roundReplay,
  };
  const payloadP2 = {
    winner_user_id: winner.userId,
    final_scores: { player1: session.score.player1, player2: session.score.player2 },
    xp_earned: session.xpGrantedP2,
    streak_current: streakP2Out,
    round_replay: session.roundReplay,
  };

  if (solo) {
    io.to(session.roomId).emit("duel_end", payloadP1);
    return;
  }

  io.to(session.player1.socketId).emit("duel_end", payloadP1);
  io.to(session.player2.socketId).emit("duel_end", payloadP2);
}
