/**
 * PATCH /api/user/profile — updates mutable profile fields (username).
 *
 * Responsibility: persist username for the session user (body already validated by router middleware).
 * Layer: backend user HTTP handlers
 * Depends on: Prisma
 * Consumers: user router
 */

import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import type { PatchProfileBody } from "../../validators/userValidators.js";

export async function patchProfile(req: AuthenticatedRequest, res: Response) {
  const body = req.body as PatchProfileBody;

  if (!body.username) {
    return res.status(400).json({ error: "No profile fields provided" });
  }
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { username: body.username },
  });

  return res.json({ id: user.id, username: user.username, avatarUrl: user.avatarUrl });
}
