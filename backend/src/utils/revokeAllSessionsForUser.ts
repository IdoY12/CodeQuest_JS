/**
 * Invalidates JWT families by bumping tokenVersion and clearing the local cache.
 *
 * Responsibility: single implementation for logout, password change, and account delete.
 * Layer: backend auth utilities
 * Depends on: Prisma, authenticatedUserTokenVersionCache
 * Consumers: authLogoutHandler, user password/account flows
 */

import { prisma } from "@project/db";
import { invalidateCachedTokenVersionForUser } from "./authenticatedUserTokenVersionCache.js";

export async function revokeAllSessionsForUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
  invalidateCachedTokenVersionForUser(userId);
}
