/**
 * GET /api/user/progress-summary — aggregates XP, streak, lessons, duel stats.
 *
 * Responsibility: parallel reads for dashboard cards on the mobile home screen.
 * Layer: backend user HTTP handlers
 * Depends on: Prisma, buildRecentStreakDays, logger
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logError } from "../../utils/logger.js";
import { buildRecentStreakDays } from "./buildRecentStreakDays.js";

export async function getProgressSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const [progress, duelRating, recentPractice, distinctCorrect] = await Promise.all([
      prisma.userProgress.findUnique({ where: { userId } }),
      prisma.duelRating.findUnique({ where: { userId } }),
      prisma.dailyPracticeLog.findMany({
        where: { userId },
        orderBy: { dateKey: "desc" },
        take: 7,
        select: { dateKey: true },
      }),
      prisma.userExerciseHistory.findMany({
        where: { userId, isCorrect: true },
        distinct: ["exerciseId"],
        select: { exercise: { select: { lessonId: true } } },
      }),
    ]);
    const lessonsCompleted = new Set(distinctCorrect.map((row) => row.exercise.lessonId)).size;
    const streakDays = buildRecentStreakDays(recentPractice.map((entry) => entry.dateKey));
    return res.json({
      xpTotal: progress?.xpTotal ?? 0,
      level: progress?.level ?? 1,
      streakCurrent: progress?.streakCurrent ?? 0,
      streakDays,
      lessonsCompleted,
      duelWins: duelRating?.wins ?? 0,
      duelLosses: duelRating?.losses ?? 0,
      duelDraws: duelRating?.draws ?? 0,
      duelRating: duelRating?.rating ?? 0,
      streakShieldAvailable: progress?.streakShieldAvailable ?? false,
    });
  } catch (error) {
    logError("[USER]", error, { phase: "progress-summary", userId: req.user?.userId });
    return res.status(500).json({ error: "Failed to load progress summary" });
  }
}
