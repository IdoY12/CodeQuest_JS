/**
 * GET /api/user/profile — returns the authenticated user's core profile fields.
 *
 * Responsibility: read user + progress + duel rating for the client shell.
 * Layer: backend user HTTP handlers
 * Depends on: Prisma, AuthenticatedRequest
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      createdAt: true,
      progress: {
        select: {
          goal: true,
          experienceLevel: true,
          dailyCommitmentMinutes: true,
          notificationsEnabled: true,
          onboardingCompleted: true,
        },
      },
      duelRating: {
        select: { rating: true, wins: true, losses: true, draws: true },
      },
    },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
}
