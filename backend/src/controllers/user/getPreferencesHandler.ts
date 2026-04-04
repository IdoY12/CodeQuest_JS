/**
 * GET /api/user/preferences — returns learning preferences for settings UI.
 *
 * Responsibility: map UserProgress row into client-facing preference DTO.
 * Layer: backend user HTTP handlers
 * Depends on: Prisma
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function getPreferences(req: AuthenticatedRequest, res: Response) {
  const progress = await prisma.userProgress.findUnique({
    where: { userId: req.user!.userId },
    include: { path: true },
  });
  if (!progress) {
    return res.status(404).json({ error: "Progress not found" });
  }
  return res.json({
    hasCompletedOnboarding: progress.onboardingCompleted,
    userGoal: progress.goal,
    userLevel: progress.experienceLevel,
    dailyGoalMinutes: progress.dailyCommitmentMinutes,
    notificationsEnabled: progress.notificationsEnabled,
    pathKey: progress.path.key,
  });
}
