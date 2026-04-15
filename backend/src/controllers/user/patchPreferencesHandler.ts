/**
 * PATCH /api/user/preferences — updates goals, level band, reminders, and active track.
 *
 * Responsibility: upsert UserProgress for selected experience level; preserve other rows.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { resolveExperienceLevel } from "@project/db";
import { logInfo, logWarn } from "../../utils/logger.js";

export async function patchPreferences(req: AuthenticatedRequest, res: Response) {
  logInfo("[AUTH]", "preferences:update-attempt", { userId: req.user?.userId });
  const parsed = z
    .object({
      goal: z.enum(["JOB", "WORK", "FUN", "PROJECT"]),
      experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR"]),
      dailyCommitmentMinutes: z.number().int().refine((value) => value === 10 || value === 15 || value === 25),
      notificationsEnabled: z.boolean(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    logWarn("[AUTH]", "preferences:update-validation-failed", { userId: req.user?.userId, errors: parsed.error.flatten() });
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const level = parsed.data.experienceLevel;
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { activeExperienceLevel: level },
  });

  const updated = await prisma.userProgress.upsert({
    where: { userId_experienceLevel: { userId: req.user!.userId, experienceLevel: level } },
    create: {
      userId: req.user!.userId,
      experienceLevel: level,
      goal: parsed.data.goal,
      dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
      notificationsEnabled: parsed.data.notificationsEnabled,
    },
    update: {
      goal: parsed.data.goal,
      dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
      notificationsEnabled: parsed.data.notificationsEnabled,
    },
  });

  return res.json({
    goal: updated.goal,
    experienceLevel: resolveExperienceLevel(updated.experienceLevel),
    dailyCommitmentMinutes: updated.dailyCommitmentMinutes,
    notificationsEnabled: updated.notificationsEnabled,
  });
}
