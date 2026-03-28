import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../@types/auth.js";
import { prisma } from "@project/db";
import { logInfo } from "../utils/logger.js";

export async function getStats(req: AuthenticatedRequest, res: Response) {
  logInfo("[DUEL]", "stats:fetch", { userId: req.user?.userId });
  const rating = await prisma.duelRating.findUnique({ where: { userId: req.user!.userId } });
  return res.json({
    rating: rating?.rating ?? 0,
    wins: rating?.wins ?? 0,
    losses: rating?.losses ?? 0,
    draws: rating?.draws ?? 0,
    rankTier: rating?.rankTier ?? "BRONZE",
  });
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  logInfo("[DUEL]", "history:fetch", { userId: req.user?.userId });
  const uid = req.user!.userId;
  const sessions = await prisma.duelSession.findMany({
    where: {
      OR: [{ player1Id: uid }, { player2Id: uid }],
    },
    orderBy: { startedAt: "desc" },
    take: 25,
  });
  return res.json(sessions);
}

export async function getLeaderboard(_req: Request, res: Response) {
  logInfo("[DUEL]", "leaderboard:fetch");
  const leaderboard = await prisma.duelRating.findMany({
    orderBy: { rating: "desc" },
    take: 50,
    include: { user: { select: { username: true, avatarId: true } } },
  });
  return res.json(leaderboard);
}

export async function getQuestions(_req: Request, res: Response) {
  logInfo("[DUEL]", "questions:fetch");
  const questions = await prisma.duelQuestion.findMany({ take: 100 });
  return res.json(questions);
}

export async function getMatchmakingStatus(_req: Request, res: Response) {
  return res.json({ playersOnline: Math.floor(Math.random() * 120) + 30, estimatedWaitSeconds: 8 });
}
