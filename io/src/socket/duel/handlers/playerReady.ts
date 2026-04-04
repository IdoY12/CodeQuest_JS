/**
 * Registers `player_ready` so only matched session sockets can start rounds.
 *
 * Responsibility: gate ready state on verified duel participant socket ids.
 * Layer: io duel handlers
 * Depends on: session state, resolveDuelPlayerSlot, startRound
 * Consumers: duel/index.ts
 */

import type { Socket } from "socket.io";
import { logError, logInfo } from "../../../utils/logger.js";
import { resolveDuelPlayerSlot } from "../resolveDuelPlayerSlot.js";
import { sessions } from "../state.js";
import { startRound } from "../session.js";
import type { DuelNamespace } from "../types.js";

export function registerPlayerReady(socket: Socket, duel: DuelNamespace) {
  socket.on("player_ready", async (payload: { session_id: string; userId?: string }) => {
    try {
      const session = sessions.get(payload.session_id);
      if (!session) return;
      const slot = resolveDuelPlayerSlot(session, socket.id);
      if (!slot) {
        logInfo("[DUEL]", "player_ready:rejected-non-participant", { socketId: socket.id });
        return;
      }
      const userId = slot === "player1" ? session.player1.userId : session.player2.userId;
      session.readyUserIds.add(userId);
      if (session.readyUserIds.size >= 2 && session.round === 0) {
        await startRound(duel, session);
      }
    } catch (error) {
      logError("[DUEL]", error, { phase: "player_ready" });
    }
  });
}
