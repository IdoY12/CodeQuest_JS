/**
 * GET /api/user/progress-summary — aggregates XP, streak, duel stats.
 *
 * Responsibility: parallel reads for dashboard cards on the mobile home screen.
 * Query `localDate` (YYYY-MM-DD, client local calendar) is required so streak open rules use the user's day boundary.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser } from "@project/db";
import { logError } from "../../utils/logger.js";
import { handleStreakAppOpen } from "../../services/streakService.js";

const progressSummaryQuery = z.object({
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function getProgressSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const parsed = progressSummaryQuery.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Query parameter localDate is required (YYYY-MM-DD)." });
    }
    const { localDate } = parsed.data;
    const userId = req.user!.userId;

    await handleStreakAppOpen(prisma, userId, localDate);

    const progress = await getProgressForActiveUser(prisma, userId);

    const [duelWins, duelLosses] = await Promise.all([
      prisma.duelSession.count({ where: { winnerId: userId } }),
      prisma.duelSession.count({
        where: {
          AND: [
            { OR: [{ player1Id: userId }, { player2Id: userId }] },
            { winnerId: { not: null } },
            { NOT: { winnerId: userId } },
          ],
        },
      }),
    ]);

    return res.json({
      xpTotal: progress?.xpTotal ?? 0,
      level: progress?.level ?? 1,
      streakCurrent: progress?.streakCurrent ?? 0,
      lessonsCompleted: progress?.currentExerciseIndex ?? 0,
      duelWins,
      duelLosses,
    });
  } catch (error) {
    logError("[USER]", error, { phase: "progress-summary", userId: req.user?.userId });
    return res.status(500).json({ error: "Failed to load progress summary" });
  }
}
