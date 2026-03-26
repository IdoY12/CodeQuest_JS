import type { Socket } from "socket.io";
import { prisma } from "../../../db/prisma.js";
import { verifyAccessToken } from "../../../utils/auth.js";
import { logInfo } from "../../../utils/logger.js";
import { handleQueueJoin } from "../queue.js";
import type { DuelNamespace, QueueEntry } from "../types.js";

export function registerJoinQueue(socket: Socket, duel: DuelNamespace) {
  socket.on("join_queue", async (payload: { token?: string; rating?: number; userId?: string; username?: string }) => {
    let userId = payload.userId ?? `guest-${socket.id.slice(0, 8)}`;
    if (payload.token) {
      try {
        const decoded = verifyAccessToken(payload.token);
        userId = decoded.userId;
      } catch {
        logInfo("[DUEL]", "queue:invalid-token", { socketId: socket.id });
      }
    }
    const user = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null);
    const ratingFromDb = await prisma.duelRating.findUnique({ where: { userId } }).catch(() => null);
    const progress = await prisma.userProgress.findUnique({ where: { userId } }).catch(() => null);

    const entry: QueueEntry = {
      socketId: socket.id,
      userId,
      username: user?.username ?? payload.username ?? "Anonymous",
      avatarId: user?.avatarId ?? "avatar-braces",
      rating: ratingFromDb?.rating ?? payload.rating ?? 1000,
      experienceLevel: progress?.experienceLevel ?? "BEGINNER",
      joinedAt: Date.now(),
    };

    handleQueueJoin(socket, duel, entry);
  });
}
