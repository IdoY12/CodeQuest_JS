/**
 * POST /api/user/practice-log — increments daily practice seconds and streak state.
 *
 * Responsibility: upsert DailyPracticeLog then apply streak rules on UserProgress.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma, applyStreakAfterPracticeLog, logger
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logInfo, logWarn } from "../../utils/logger.js";
import { applyStreakAfterPracticeLog } from "./applyStreakAfterPracticeLog.js";

export async function postPracticeLog(req: AuthenticatedRequest, res: Response) {
  logInfo("[TASKS]", "practice-log:write-attempt", { userId: req.user?.userId, dateKey: req.body?.dateKey });
  const parsed = z
    .object({
      dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      practicedSeconds: z.number().int().min(1).max(60 * 60),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    logWarn("[TASKS]", "practice-log:validation-failed", { userId: req.user?.userId, errors: parsed.error.flatten() });
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const userId = req.user!.userId;
  const { dateKey, practicedSeconds } = parsed.data;
  const log = await prisma.dailyPracticeLog.upsert({
    where: {
      userId_dateKey: { userId, dateKey },
    },
    create: {
      userId,
      dateKey,
      practicedSeconds,
    },
    update: {
      practicedSeconds: { increment: practicedSeconds },
    },
  });

  const progress = await prisma.userProgress.findUnique({
    where: { userId },
    select: { streakCurrent: true, streakLastDate: true, streakLongest: true, streakShieldAvailable: true },
  });

  if (progress) {
    await applyStreakAfterPracticeLog(prisma, userId, parsed.data.dateKey, progress);
  }
  logInfo("[TASKS]", "practice-log:write-success", { userId: req.user?.userId, practicedSeconds: log.practicedSeconds });
  return res.json({ practicedSeconds: log.practicedSeconds });
}
