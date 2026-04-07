/**
 * PATCH /api/user/preferences — updates goals, level band, reminders, and path.
 *
 * Responsibility: upsert progress with validated enums and resolved path id.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma, userPathUtils, logger
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logInfo, logWarn } from "../../utils/logger.js";
import { resolvePathKey } from "./userPathUtils.js";

export async function patchPreferences(req: AuthenticatedRequest, res: Response) {
  logInfo("[AUTH]", "preferences:update-attempt", { userId: req.user?.userId });
  const parsed = z
    .object({
      goal: z.enum(["JOB", "WORK", "FUN", "PROJECT"]),
      experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR"]),
      dailyCommitmentMinutes: z.number().int().refine((value) => value === 10 || value === 15 || value === 30),
      notificationsEnabled: z.boolean(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    logWarn("[AUTH]", "preferences:update-validation-failed", { userId: req.user?.userId, errors: parsed.error.flatten() });
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const pathKey = resolvePathKey(parsed.data.experienceLevel);
  const path = await prisma.learningPath.findUnique({ where: { key: pathKey } });
  if (!path) return res.status(400).json({ error: "Assigned learning path not found" });

  const updated = await prisma.userProgress.upsert({
    where: { userId: req.user!.userId },
    create: {
      userId: req.user!.userId,
      pathId: path.id,
      goal: parsed.data.goal,
      experienceLevel: parsed.data.experienceLevel,
      dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
      notificationsEnabled: parsed.data.notificationsEnabled,
      onboardingCompleted: true,
    },
    update: {
      pathId: path.id,
      goal: parsed.data.goal,
      experienceLevel: parsed.data.experienceLevel,
      dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
      notificationsEnabled: parsed.data.notificationsEnabled,
    },
    include: { path: true },
  });

  return res.json({
    hasCompletedOnboarding: updated.onboardingCompleted,
    goal: updated.goal,
    experienceLevel: updated.experienceLevel,
    dailyCommitmentMinutes: updated.dailyCommitmentMinutes,
    notificationsEnabled: updated.notificationsEnabled,
    pathKey: updated.path.key,
  });
}
