/**
 * PATCH /api/user/preferences — updates goals, level band, reminders, and active track.
 *
 * Responsibility: upsert UserProgress for selected experience level; preserve other rows.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { resolveExperienceLevel } from "@project/db";
import { logInfo } from "../../utils/logger.js";
import type { PatchPreferencesBody } from "../../validators/userValidators.js";

export async function patchPreferences(req: AuthenticatedRequest, res: Response) {
  logInfo("[AUTH]", "preferences:update-attempt", { userId: req.user?.userId });
  const data = req.validatedBody as PatchPreferencesBody;

  const level = data.experienceLevel;
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { activeExperienceLevel: level },
  });

  const updated = await prisma.userProgress.upsert({
    where: { userId_experienceLevel: { userId: req.user!.userId, experienceLevel: level } },
    create: {
      userId: req.user!.userId,
      experienceLevel: level,
      goal: data.goal,
      dailyCommitmentMinutes: data.dailyCommitmentMinutes,
      notificationsEnabled: data.notificationsEnabled,
    },
    update: {
      goal: data.goal,
      dailyCommitmentMinutes: data.dailyCommitmentMinutes,
      notificationsEnabled: data.notificationsEnabled,
    },
  });

  return res.json({
    goal: updated.goal,
    experienceLevel: resolveExperienceLevel(updated.experienceLevel),
    dailyCommitmentMinutes: updated.dailyCommitmentMinutes,
    notificationsEnabled: updated.notificationsEnabled,
  });
}
