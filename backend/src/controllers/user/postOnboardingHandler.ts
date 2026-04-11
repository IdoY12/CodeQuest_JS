/**
 * POST /api/user/onboarding — stores first-run goals and sets active experience track.
 *
 * Responsibility: upsert UserProgress for selected experience level.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { pathKeyFromExperience } from "@project/db";
import { logError, logInfo, logWarn } from "../../utils/logger.js";

export async function postOnboarding(req: AuthenticatedRequest, res: Response) {
  logInfo("[ONBOARDING]", "submit:attempt", { userId: req.user?.userId });
  const parsed = z
    .object({
      goal: z.enum(["JOB", "WORK", "FUN", "PROJECT"]),
      experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR"]),
      dailyCommitmentMinutes: z.number().int().min(10).max(60),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    logWarn("[ONBOARDING]", "submit:validation-failed", { errors: parsed.error.flatten(), userId: req.user?.userId });
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
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
        onboardingCompleted: true,
        notificationsEnabled: true,
      },
      update: {
        goal: parsed.data.goal,
        dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
        onboardingCompleted: true,
      },
    });

    logInfo("[ONBOARDING]", "submit:success", { userId: req.user?.userId, experienceLevel: level });
    return res.json({
      onboardingCompleted: updated.onboardingCompleted,
      pathKey: pathKeyFromExperience(updated.experienceLevel),
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
