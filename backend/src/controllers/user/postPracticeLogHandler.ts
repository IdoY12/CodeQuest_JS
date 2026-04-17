/**
 * POST /api/user/practice-log — increments daily practice seconds.
 *
 * Responsibility: update active UserProgress row practice counters only.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser } from "@project/db";
import { logInfo, logWarn } from "../../utils/logger.js";

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

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      practiceLogDateKey: dateKey,
      practiceLogSeconds: nextSeconds,
    },
  });

  logInfo("[TASKS]", "practice-log:write-success", { userId: req.user?.userId, practicedSeconds: nextSeconds });

  return res.json({ practicedSeconds: nextSeconds });
}
