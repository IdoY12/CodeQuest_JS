/**
 * POST /api/user/daily-goal-status/:dateKey/mark-notified — records reminder sends.
 *
 * Responsibility: bump incomplete reminder count or mark complete reminder sent on UserProgress.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser } from "@project/db";
import type { DailyGoalDateKeyParams, PostDailyGoalMarkNotifiedBody } from "../../validators/userValidators.js";

export async function postDailyGoalStatusMarkNotified(req: AuthenticatedRequest, res: Response) {
  const { dateKey } = req.validatedParams as DailyGoalDateKeyParams;
  const { type } = req.validatedBody as PostDailyGoalMarkNotifiedBody;

  const userId = req.user!.userId;
  const progress = await getProgressForActiveUser(prisma, userId);

  if (!progress) return res.status(404).json({ error: "Progress not found" });

  const sameDay = progress.practiceLogDateKey === dateKey;

  if (type === "INCOMPLETE") {
    await prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        practiceLogDateKey: dateKey,
        practiceLogSeconds: sameDay ? progress.practiceLogSeconds : 0,
        practiceLogIncompleteReminders: sameDay ? { increment: 1 } : 1,
        practiceLogCompleteSent: sameDay ? progress.practiceLogCompleteSent : false,
      },
    });
  } else {
    await prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        practiceLogDateKey: dateKey,
        practiceLogSeconds: sameDay ? progress.practiceLogSeconds : 0,
        practiceLogCompleteSent: true,
      },
    });
  }

  const updated = await prisma.userProgress.findUniqueOrThrow({ where: { id: progress.id } });

  return res.json({
    dateKey,
    incompleteReminderCount: updated.practiceLogIncompleteReminders,
    completeReminderSent: updated.practiceLogCompleteSent,
  });
}
