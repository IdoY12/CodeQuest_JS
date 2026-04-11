/**
 * POST /api/user/practice-log — increments daily practice seconds and streak state.
 *
 * Responsibility: update active UserProgress row + streakHistoryJson; apply streak rules.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser, mergeStreakHistoryJson } from "@project/db";
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
  const progress = await getProgressForActiveUser(prisma, userId);
  if (!progress) {
    return res.status(404).json({ error: "Progress not found" });
  }

  const sameDay = progress.practiceLogDateKey === dateKey;
  const nextSeconds = sameDay ? progress.practiceLogSeconds + practicedSeconds : practicedSeconds;
  const nextHistory = mergeStreakHistoryJson(progress.streakHistoryJson, dateKey);

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      practiceLogDateKey: dateKey,
      practiceLogSeconds: nextSeconds,
      streakHistoryJson: nextHistory,
    },
  });

  await applyStreakAfterPracticeLog(prisma, userId, progress.experienceLevel, dateKey, {
    streakCurrent: progress.streakCurrent,
    streakLastDate: progress.streakLastDate,
    streakLongest: progress.streakLongest,
    streakShieldAvailable: progress.streakShieldAvailable,
  });

  logInfo("[TASKS]", "practice-log:write-success", { userId: req.user?.userId, practicedSeconds: nextSeconds });
  return res.json({ practicedSeconds: nextSeconds });
}
