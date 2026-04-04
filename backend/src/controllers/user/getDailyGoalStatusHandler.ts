/**
 * GET /api/user/daily-goal-status/:dateKey — practice minutes vs goal for a day.
 *
 * Responsibility: combine UserProgress with DailyPracticeLog for reminders UI.
 * Layer: backend user HTTP handlers
 * Depends on: Prisma
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function getDailyGoalStatus(req: AuthenticatedRequest, res: Response) {
  const dateKey = String(req.params.dateKey);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return res.status(400).json({ error: "Invalid date key format" });
  }
  const [progress, log] = await Promise.all([
    prisma.userProgress.findUnique({ where: { userId: req.user!.userId } }),
    prisma.dailyPracticeLog.findUnique({
      where: {
        userId_dateKey: {
          userId: req.user!.userId,
          dateKey,
        },
      },
    }),
  ]);
  if (!progress) return res.status(404).json({ error: "Progress not found" });

  const goalMinutes = progress.dailyCommitmentMinutes ?? 15;
  const practicedMinutes = Math.floor((log?.practicedSeconds ?? 0) / 60);
  const remainingMinutes = Math.max(0, goalMinutes - practicedMinutes);
  const canSendIncomplete = progress.notificationsEnabled && remainingMinutes > 0 && (log?.incompleteReminderCount ?? 0) < 2;
  const canSendComplete = progress.notificationsEnabled && remainingMinutes === 0 && !(log?.completeReminderSent ?? false);
  const shieldConsumedDateKey = progress.streakShieldConsumedAt
    ? new Date(progress.streakShieldConsumedAt).toLocaleDateString("en-CA")
    : null;
  return res.json({
    dateKey,
    goalMinutes,
    practicedMinutes,
    remainingMinutes,
    notificationsEnabled: progress.notificationsEnabled,
    streakShieldAvailable: progress.streakShieldAvailable,
    shieldConsumedToday: shieldConsumedDateKey === dateKey,
    canSendIncomplete,
    canSendComplete,
  });
}
