/**
 * GET /api/user/preferences — returns learning preferences for settings UI.
 *
 * Responsibility: map active UserProgress row into client-facing preference DTO.
 * Layer: backend user HTTP handlers
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma, getProgressForActiveUser, resolveExperienceLevel } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function getPreferences(req: AuthenticatedRequest, res: Response) {
  const progress = await getProgressForActiveUser(prisma, req.user!.userId);

  if (!progress) {
    return res.status(404).json({ error: "Progress not found" });
  }

  return res.json({
    userGoal: progress.goal,
    experienceLevel: resolveExperienceLevel(progress.experienceLevel),
    dailyGoalMinutes: progress.dailyCommitmentMinutes,
    notificationsEnabled: progress.notificationsEnabled,
  });
}
