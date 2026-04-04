/**
 * POST /api/user/daily-goal-status/:dateKey/mark-notified — records reminder sends.
 *
 * Responsibility: bump incomplete reminder count or mark complete reminder sent.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function postDailyGoalStatusMarkNotified(req: AuthenticatedRequest, res: Response) {
  const dateKey = String(req.params.dateKey);
  const parsed = z.object({ type: z.enum(["INCOMPLETE", "COMPLETE"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return res.status(400).json({ error: "Invalid date key format" });
  }

  const userId = req.user!.userId;
  let log = await prisma.dailyPracticeLog.findUnique({
    where: { userId_dateKey: { userId, dateKey } },
  });
  if (!log) {
    log = await prisma.dailyPracticeLog.create({
      data: {
        userId,
        dateKey,
        practicedSeconds: 0,
        incompleteReminderCount: parsed.data.type === "INCOMPLETE" ? 1 : 0,
        completeReminderSent: parsed.data.type === "COMPLETE",
      },
    });
  } else if (parsed.data.type === "INCOMPLETE") {
    log = await prisma.dailyPracticeLog.update({
      where: { userId_dateKey: { userId, dateKey } },
      data: { incompleteReminderCount: { increment: 1 } },
    });
  } else {
    log = await prisma.dailyPracticeLog.update({
      where: { userId_dateKey: { userId, dateKey } },
      data: { completeReminderSent: true },
    });
  }

  return res.json({
    dateKey,
    incompleteReminderCount: log.incompleteReminderCount,
    completeReminderSent: log.completeReminderSent,
  });
}
