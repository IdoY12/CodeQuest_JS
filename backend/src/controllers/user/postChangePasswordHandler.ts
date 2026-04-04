/**
 * POST /api/user/change-password — verifies current password then rotates hash + JWTs.
 *
 * Responsibility: bcrypt compare/update and tokenVersion bump with cache invalidation.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma, password helpers, token cache
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { invalidateCachedTokenVersionForUser } from "../../utils/authenticatedUserTokenVersionCache.js";
import { comparePassword, hashPassword } from "../../utils/passwordHashing.js";

export async function postChangePassword(req: AuthenticatedRequest, res: Response) {
  const parsed = z
    .object({ currentPassword: z.string().min(6), newPassword: z.string().min(6) })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const valid = await comparePassword(parsed.data.currentPassword, user.hashedPassword);
  if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: {
      hashedPassword: await hashPassword(parsed.data.newPassword),
      tokenVersion: { increment: 1 },
    },
  });
  invalidateCachedTokenVersionForUser(req.user!.userId);
  return res.json({ ok: true });
}
