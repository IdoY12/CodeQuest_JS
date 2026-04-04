/**
 * GET /api/user/avatar/presigned-url — issues a short-lived S3 upload URL.
 *
 * Responsibility: validate query metadata and return presigned PUT target.
 * Layer: backend user HTTP handlers
 * Depends on: crypto randomUUID, zod, storage utils, logger
 * Consumers: user router
 */

import { randomUUID } from "crypto";
import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { createAvatarUploadUrl, getAvatarPublicUrl } from "../../utils/storage.js";
import { logError } from "../../utils/logger.js";

export async function getAvatarPresignedUrl(req: AuthenticatedRequest, res: Response) {
  const parsed = z
    .object({
      contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      fileSize: z.coerce.number().int().min(1).max(5 * 1024 * 1024),
    })
    .safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid upload metadata" });
  }

  const ext = parsed.data.contentType === "image/jpeg" ? "jpg" : parsed.data.contentType === "image/png" ? "png" : "webp";
  const key = `avatars/${req.user!.userId}/${randomUUID()}.${ext}`;

  try {
    const uploadUrl = await createAvatarUploadUrl({
      key,
      contentType: parsed.data.contentType,
    });
    const publicUrl = getAvatarPublicUrl(key);
    return res.json({ uploadUrl, publicUrl, maxSizeBytes: 5 * 1024 * 1024 });
  } catch (error) {
    logError("[USER]", error, { phase: "avatar-presign", userId: req.user?.userId });
    return res.status(500).json({ error: "Unable to prepare avatar upload" });
  }
}
