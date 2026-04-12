/**
 * Applies winner/loser Elo-style rating adjustments after a duel ends.
 *
 * Responsibility: Prisma upserts for duelRating rows used by matchmaking.
 * Layer: io duel session
 * Depends on: @project/db
 * Consumers: endSession.ts
 */

import { prisma } from "@project/db";
import type { SessionState } from "./types.js";

export async function updateDuelRatingsAfterMatch(session: SessionState, winnerIsP1: boolean): Promise<void> {
  const winner = winnerIsP1 ? session.player1 : session.player2;
  const loser = winnerIsP1 ? session.player2 : session.player1;

  const wr = await prisma.duelRating.findUnique({ where: { userId: winner.userId } });
  if (!wr) {
    await prisma.duelRating.create({ data: { userId: winner.userId, rating: 1050, wins: 1 } }).catch(() => null);
  } else {
    await prisma.duelRating
      .update({
        where: { userId: winner.userId },
        data: { rating: { increment: 50 }, wins: { increment: 1 } },
      })
      .catch(() => null);
  }

  const lr = await prisma.duelRating.findUnique({ where: { userId: loser.userId } });
  if (!lr) {
    await prisma.duelRating.create({ data: { userId: loser.userId, rating: 980, losses: 1 } }).catch(() => null);
  } else {
    await prisma.duelRating
      .update({
        where: { userId: loser.userId },
        data: { rating: { decrement: 20 }, losses: { increment: 1 } },
      })
      .catch(() => null);
  }
}
