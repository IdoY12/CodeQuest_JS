/**
 * GET /api/user/progress-summary — aggregates XP, streak, duel stats.
 *
 * Responsibility: parallel reads for dashboard cards on the mobile home screen.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser, streakHistoryAsStrings } from "@project/db";
import { logError } from "../../utils/logger.js";
import { buildRecentStreakDays } from "./buildRecentStreakDays.js";

export async function getProgressSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const [progress, duelRating] = await Promise.all([
      getProgressForActiveUser(prisma, userId),
      prisma.duelRating.findUnique({ where: { userId } }),
    ]);
    const streakKeys = streakHistoryAsStrings(progress?.streakHistoryJson);
    const streakDays = buildRecentStreakDays(streakKeys);

    return res.json({
      xpTotal: progress?.xpTotal ?? 0,
      level: progress?.level ?? 1,
      streakCurrent: progress?.streakCurrent ?? 0,
      streakDays,
      lessonsCompleted: progress?.currentExerciseIndex ?? 0,
      duelWins: duelRating?.wins ?? 0,
      duelLosses: duelRating?.losses ?? 0,
      duelRating: duelRating?.rating ?? 0,
    });
  } catch (error) {
    logError("[USER]", error, { phase: "progress-summary", userId: req.user?.userId });
    return res.status(500).json({ error: "Failed to load progress summary" });
  }
}
