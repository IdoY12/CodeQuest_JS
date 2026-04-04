/**
 * PATCH /api/user/avatar — persists avatar URL after client upload to our bucket.
 *
 * Responsibility: validate URL belongs to bucket and remove prior object if replaced.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma, storage helpers, logger
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { deleteAvatarObject, extractAvatarKeyFromUrl } from "../../utils/storage.js";
import { logWarn } from "../../utils/logger.js";

export async function patchAvatar(req: AuthenticatedRequest, res: Response) {
  const parsed = z.object({ avatarUrl: z.string().url() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid avatar URL" });

  const nextKey = extractAvatarKeyFromUrl(parsed.data.avatarUrl);
  if (!nextKey) {
    return res.status(400).json({ error: "Avatar URL is not from configured storage bucket" });
  }

  const current = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { avatarUrl: true },
  });
  if (!current) return res.status(404).json({ error: "User not found" });

  const previousAvatarUrl = current.avatarUrl;
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { avatarUrl: parsed.data.avatarUrl },
  });

  if (previousAvatarUrl) {
    const oldKey = extractAvatarKeyFromUrl(previousAvatarUrl);
    if (oldKey && oldKey !== nextKey) {
      try {
        await deleteAvatarObject(oldKey);
      } catch (error) {
        logWarn("[USER]", "avatar:old-delete-failed", { userId: req.user?.userId, reason: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  return res.json({ avatarUrl: parsed.data.avatarUrl });
}
