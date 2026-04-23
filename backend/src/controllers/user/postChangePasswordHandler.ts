/**
 * POST /api/user/change-password — verifies current password then rotates hash + JWTs.
 *
 * Responsibility: bcrypt compare/update and tokenVersion bump with cache invalidation.
 * Layer: backend user HTTP handlers
 * Depends on: Prisma, password helpers, token cache
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { invalidateCachedTokenVersionForUser } from "../../utils/authenticatedUserTokenVersionCache.js";
import { comparePassword, hashPassword } from "../../utils/passwordHashing.js";
import type { PostChangePasswordBody } from "../../validators/userValidators.js";

export async function postChangePassword(req: AuthenticatedRequest, res: Response) {
  const { currentPassword, newPassword } = req.body as PostChangePasswordBody;

  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });

  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await comparePassword(currentPassword, user.hashedPassword);

  if (!isPasswordValid) return res.status(401).json({ error: "Current password is incorrect" });
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: {
      hashedPassword: await hashPassword(newPassword),
      tokenVersion: { increment: 1 },
    },
  });
  invalidateCachedTokenVersionForUser(req.user!.userId);

  return res.json({ ok: true });
}
