/**
 * PATCH /api/user/profile — updates mutable profile fields (username).
 *
 * Responsibility: validate body and persist username for the session user.
 * Layer: backend user HTTP handlers
 * Depends on: zod, Prisma
 * Consumers: user router
 */

import type { Response } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";

export async function patchProfile(req: AuthenticatedRequest, res: Response) {
  const parsed = z
    .object({
      username: z.string().min(2).max(30).optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (!parsed.data.username) {
    return res.status(400).json({ error: "No profile fields provided" });
  }
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { username: parsed.data.username },
  });

  return res.json({ id: user.id, username: user.username, avatarUrl: user.avatarUrl });
}
