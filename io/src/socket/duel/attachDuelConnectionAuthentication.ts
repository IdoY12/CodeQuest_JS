import type { Server } from "socket.io";
import { prisma } from "@project/db";
import { logInfo } from "../../utils/logger.js";
import { verifySocketAccessToken } from "../../utils/verifySocketAccessToken.js";

export function attachDuelConnectionAuthentication(duelNamespace: ReturnType<Server["of"]>): void {
  duelNamespace.use(async (socket, next) => {
    const handshakeAuth = socket.handshake.auth as { token?: unknown } | undefined;
    const rawToken = handshakeAuth?.token ?? socket.handshake.query?.token;
    const token = typeof rawToken === "string" ? rawToken : "";

    if (!token) {
      socket.data.authenticatedUserId = undefined;
      next();
      return;
    }

    try {
      const decoded = verifySocketAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { tokenVersion: true },
      });

      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        socket.data.authenticatedUserId = undefined;
        logInfo("[DUEL]", "socket:token-version-mismatch", { socketId: socket.id });
        next();
        return;
      }
      socket.data.authenticatedUserId = decoded.userId;
    } catch {
      socket.data.authenticatedUserId = undefined;
      logInfo("[DUEL]", "socket:invalid-token", { socketId: socket.id });
    }
    next();
  });
}
