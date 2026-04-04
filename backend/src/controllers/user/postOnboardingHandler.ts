/**
 * POST /api/user/onboarding — stores first-run goals and assigns a learning path.
 *
 * Responsibility: upsert UserProgress with onboarding flags after validation.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma, userPathUtils, logger
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logError, logInfo, logWarn } from "../../utils/logger.js";
import { resolvePathKey } from "./userPathUtils.js";

export async function postOnboarding(req: AuthenticatedRequest, res: Response) {
  logInfo("[ONBOARDING]", "submit:attempt", { userId: req.user?.userId });
  const parsed = z
    .object({
      goal: z.enum(["JOB", "WORK", "FUN", "PROJECT"]),
      experienceLevel: z.enum(["BEGINNER", "BASICS", "INTERMEDIATE", "ADVANCED"]),
      dailyCommitmentMinutes: z.number().int().min(10).max(60),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    logWarn("[ONBOARDING]", "submit:validation-failed", { errors: parsed.error.flatten(), userId: req.user?.userId });
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const assignedPathKey = resolvePathKey(parsed.data.experienceLevel);
    const assignedPath = await prisma.learningPath.findUnique({ where: { key: assignedPathKey } });
    if (!assignedPath) return res.status(400).json({ error: "Assigned learning path not found" });

    const updated = await prisma.userProgress.upsert({
      where: { userId: req.user!.userId },
      create: {
        userId: req.user!.userId,
        pathId: assignedPath.id,
        goal: parsed.data.goal,
        experienceLevel: parsed.data.experienceLevel,
        dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
        onboardingCompleted: true,
        notificationsEnabled: true,
      },
      update: {
        goal: parsed.data.goal,
        experienceLevel: parsed.data.experienceLevel,
        dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
        onboardingCompleted: true,
        pathId: assignedPath.id,
      },
      include: { path: true },
    });

    logInfo("[ONBOARDING]", "submit:success", { userId: req.user?.userId, pathKey: updated.path.key });
    return res.json({
      onboardingCompleted: updated.onboardingCompleted,
      pathKey: updated.path.key,
      goal: updated.goal,
      experienceLevel: updated.experienceLevel,
      dailyCommitmentMinutes: updated.dailyCommitmentMinutes,
      notificationsEnabled: updated.notificationsEnabled,
    });
  } catch (error) {
    logError("[ONBOARDING]", error, { phase: "submit", userId: req.user?.userId });
    return res.status(500).json({ error: "Failed to save onboarding" });
  }
}
