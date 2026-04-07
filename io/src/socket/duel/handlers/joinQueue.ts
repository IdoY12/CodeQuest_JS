/**
 * Registers `join_queue` after verifying JWT-backed user context on the socket.
 *
 * Responsibility: load profile snapshot and enqueue for matchmaking.
 * Layer: io duel handlers
 * Depends on: Prisma, queue handleQueueJoin
 * Consumers: duel/index.ts
 */

import type { Socket } from "socket.io";
import { prisma } from "@project/db";
import { logInfo } from "../../../utils/logger.js";
import { handleQueueJoin } from "../queue.js";
import type { DuelNamespace, QueueEntry } from "../types.js";

export function registerJoinQueue(socket: Socket, duel: DuelNamespace) {
  socket.on("join_queue", async (payload: { rating?: number; username?: string }) => {
    const authenticatedUserId = socket.data.authenticatedUserId;
    if (!authenticatedUserId) {
      socket.emit("queue_rejected", { reason: "authentication_required" });
      logInfo("[DUEL]", "queue:rejected-unauthenticated", { socketId: socket.id });
      return;
    }
    const userId = authenticatedUserId;
    const [user, ratingFromDb, progress] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }).catch(() => null),
      prisma.duelRating.findUnique({ where: { userId } }).catch(() => null),
      prisma.userProgress.findUnique({ where: { userId } }).catch(() => null),
    ]);
    const entry: QueueEntry = {
      socketId: socket.id,
      userId,
      username: user?.username ?? payload.username ?? "Anonymous",
      avatarId: user?.avatarId ?? "avatar-braces",
      rating: ratingFromDb?.rating ?? payload.rating ?? 1000,
      experienceLevel: progress?.experienceLevel ?? "JUNIOR",
      joinedAt: Date.now(),
    };
    handleQueueJoin(socket, duel, entry);
  });
}
