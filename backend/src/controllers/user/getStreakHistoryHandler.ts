/**
 * GET /api/user/streak-history — last practice days for the active experience row.
 *
 * Responsibility: read `UserProgress.streakHistoryJson` for the user's active level
 * (same row `POST /user/practice-log` updates) and return sorted date keys, newest first.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser, streakHistoryAsStrings } from "@project/db";

export async function getStreakHistory(_req: AuthenticatedRequest, res: Response) {
  const progress = await getProgressForActiveUser(prisma, _req.user!.userId);
  const dates = streakHistoryAsStrings(progress?.streakHistoryJson).sort((a: string, b: string) => b.localeCompare(a));
  return res.json(dates);
}
