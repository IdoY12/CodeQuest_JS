/**
 * Finalizes a duel: notify clients, persist session, update ratings, grant XP.
 *
 * Responsibility: teardown timers, emit duel_end, write DB, clear memory session.
 * Layer: io duel session
 * Depends on: Prisma, rewards, state map, updateDuelRatingsAfterMatch
 * Consumers: roundTimeoutFlow, submitAnswer
 */

import { prisma } from "@project/db";
import { applyXpReward } from "./rewards.js";
import { sessions } from "./state.js";
import type { DuelNamespace, SessionState } from "./types.js";
import { updateDuelRatingsAfterMatch } from "./updateDuelRatingsAfterMatch.js";

export async function endSession(io: DuelNamespace, session: SessionState) {
  if (session.roundTimeout) {
    clearTimeout(session.roundTimeout);
    session.roundTimeout = null;
  }

  const winnerIsP1 = session.score.player1 >= session.score.player2;
  const winner = winnerIsP1 ? session.player1 : session.player2;

  io.to(session.player1.socketId).emit("duel_end", {
    winner_user_id: winner.userId,
    final_scores: { player1: session.score.player1, player2: session.score.player2 },
    rating_change: winnerIsP1 ? 50 : -20,
    xp_earned: winnerIsP1 ? 100 : 30,
    round_replay: session.roundReplay,
  });
  io.to(session.player2.socketId).emit("duel_end", {
    winner_user_id: winner.userId,
    final_scores: { player1: session.score.player1, player2: session.score.player2 },
    rating_change: winnerIsP1 ? -20 : 50,
    xp_earned: winnerIsP1 ? 30 : 100,
    round_replay: session.roundReplay,
  });

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

  await updateDuelRatingsAfterMatch(session, winnerIsP1);
  await applyXpReward(session.player1.userId, winnerIsP1 ? 100 : 30);
  await applyXpReward(session.player2.userId, winnerIsP1 ? 30 : 100);
}
