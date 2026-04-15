/**
 * Avatar handlers:
 *   PUT  /api/user/avatar/upload — accepts raw image bytes, uploads to S3 server-side,
 *                                  returns { publicUrl }. No presigned URL involved so
 *                                  LAN devices are not affected by localhost/signature issues.
 *   PATCH /api/user/avatar       — persists avatar URL after upload to our bucket.
 *
 * Responsibility: server-side S3 upload and avatar URL persistence.
 * Layer: backend user HTTP handlers
 * Depends on: crypto, zod, Prisma, storage helpers, logger
 * Consumers: user router
 */

import { randomUUID } from "crypto";
import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import {
  deleteAvatarObject,
  extractAvatarKeyFromUrl,
  getAvatarPublicUrl,
  putAvatarObject,
  rewriteLocalS3UrlForClient,
} from "../../utils/storage.js";
import { logError, logInfo, logWarn } from "../../utils/logger.js";

export async function putAvatarDirectUpload(req: AuthenticatedRequest, res: Response) {
  const body = req.body as Buffer;

  if (!Buffer.isBuffer(body) || body.length === 0) {
    return res.status(400).json({ error: "Empty or invalid image body" });
  }
  const key = `avatars/${req.user!.userId}/${randomUUID()}.jpg`;

  try {
    await putAvatarObject(key, body, "image/jpeg");
    const publicUrl = rewriteLocalS3UrlForClient(getAvatarPublicUrl(key), req.hostname);
    logInfo("[USER]", "avatar:upload-ok", { userId: req.user?.userId, bytes: body.length, publicUrl });

    return res.json({ publicUrl });
  } catch (error) {
    logError("[USER]", error, { phase: "avatar-direct-upload", userId: req.user?.userId });

    return res.status(500).json({ error: "Upload failed" });
  }
}

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
