/**
 * GET /api/user/streak-history — recent streak log rows for profile visualization.
 *
 * Responsibility: return last 90 streak log entries ordered by date.
 * Layer: backend user HTTP handlers
 * Depends on: Prisma
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function getStreakHistory(req: AuthenticatedRequest, res: Response) {
  const logs = await prisma.streakLog.findMany({
    where: { userId: req.user!.userId },
    orderBy: { date: "desc" },
    take: 90,
  });
  return res.json(logs);
}
