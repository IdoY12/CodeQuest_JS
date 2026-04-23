/**
 * GET /api/user/daily-goal-status/:dateKey — practice minutes vs goal for a day.
 *
 * Responsibility: read active UserProgress practice fields for reminders UI.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser, prisma } from "@project/db";
import type { DailyGoalDateKeyParams } from "../../validators/userValidators.js";

export async function getDailyGoalStatus(req: AuthenticatedRequest, res: Response) {
  const { dateKey } = req.validatedParams as DailyGoalDateKeyParams;
  const progress = await getProgressForActiveUser(prisma, req.user!.userId);

  if (!progress) return res.status(404).json({ error: "Progress not found" });

  const sameDay = progress.practiceLogDateKey === dateKey;
  const goalMinutes = progress.dailyCommitmentMinutes ?? 15;
  const practicedMinutes = sameDay ? Math.floor(progress.practiceLogSeconds / 60) : 0;
  const remainingMinutes = Math.max(0, goalMinutes - practicedMinutes);
  const incompleteCount = sameDay ? progress.practiceLogIncompleteReminders : 0;
  const completeSent = sameDay ? progress.practiceLogCompleteSent : false;
  const canSendIncomplete = progress.notificationsEnabled && remainingMinutes > 0 && incompleteCount < 2;
  const canSendComplete = progress.notificationsEnabled && remainingMinutes === 0 && !completeSent;

  return res.json({
    dateKey,
    goalMinutes,
    practicedMinutes,
    remainingMinutes,
    notificationsEnabled: progress.notificationsEnabled,
    canSendIncomplete,
    canSendComplete,
  });
}
