/**
 * DELETE /api/user/account — hard-deletes user data after typed confirmation.
 *
 * Responsibility: transactional cleanup of related rows and optional avatar delete.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma, storage, logger, token cache
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { invalidateCachedTokenVersionForUser } from "../../utils/authenticatedUserTokenVersionCache.js";
import { deleteAvatarObject, extractAvatarKeyFromUrl } from "../../utils/storage.js";
import { logWarn } from "../../utils/logger.js";

export async function deleteAccount(req: AuthenticatedRequest, res: Response) {
  const parsed = z.object({ confirmation: z.literal("DELETE") }).safeParse(req.body ?? {});

  if (!parsed.success) {
    return res.status(400).json({ error: "Confirmation text mismatch" });
  }

  const userId = req.user!.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, avatarUrl: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const avatarKey = user.avatarUrl ? extractAvatarKeyFromUrl(user.avatarUrl) : null;

  invalidateCachedTokenVersionForUser(userId);
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
    await tx.duelSession.updateMany({
      where: { winnerId: userId },
      data: { winnerId: null },
    });
    await tx.duelSession.deleteMany({
      where: { OR: [{ player1Id: userId }, { player2Id: userId }] },
    });
    await tx.duelRating.deleteMany({ where: { userId } });
    await tx.userProgress.deleteMany({ where: { userId } });
    await tx.user.delete({ where: { id: userId } });
  });

  if (avatarKey) {
    try {
      await deleteAvatarObject(avatarKey);
    } catch (error) {
      logWarn("[USER]", "avatar:delete-failed-during-account-delete", {
        userId,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return res.status(204).send();
}
