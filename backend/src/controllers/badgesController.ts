import type { Response } from "express";
import type { AuthenticatedRequest } from "../@types/auth.js";
import { prisma } from "../db/prisma.js";

export async function listBadges(req: AuthenticatedRequest, res: Response) {
  const badges = await prisma.badge.findMany();
  const earned = await prisma.userBadge.findMany({ where: { userId: req.user!.userId } });
  const earnedSet = new Set(earned.map((e) => e.badgeId));
  const merged = badges.map((badge) => ({
    ...badge,
    earned: earnedSet.has(badge.id),
  }));
  return res.json(merged);
}
