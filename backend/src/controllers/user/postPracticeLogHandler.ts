/**
 * POST /api/user/practice-log — increments daily practice seconds.
 *
 * Responsibility: update active UserProgress row practice counters only.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { getProgressForActiveUser } from "@project/db";
import { logInfo } from "../../utils/logger.js";
import type { PostPracticeLogBody } from "../../validators/userValidators.js";

export async function postPracticeLog(req: AuthenticatedRequest, res: Response) {
  const { dateKey, practicedSeconds } = req.validatedBody as PostPracticeLogBody;
  logInfo("[TASKS]", "practice-log:write-attempt", { userId: req.user?.userId, dateKey });

  const userId = req.user!.userId;
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
