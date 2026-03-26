import type { Server, Socket } from "socket.io";
import { logInfo } from "../../utils/logger.js";
import { registerDisconnect } from "./handlers/disconnect.js";
import { registerJoinQueue } from "./handlers/joinQueue.js";
import { registerLeaveQueue } from "./handlers/leaveQueue.js";
import { registerPlayerReady } from "./handlers/playerReady.js";
import { registerSubmitAnswer } from "./handlers/submitAnswer.js";

export function attachDuelNamespace(io: Server) {
  // Create a dedicated Socket.IO namespace for duel features.
  const duel = io.of("/duel");

  duel.on("connection", (socket: Socket) => {
    // Log each namespace-level socket connection for observability.
    logInfo("[DUEL]", "socket:connected", { socketId: socket.id });
    // Send immediate queue meta so the client can render initial matchmaking UI.
    socket.emit("queue_status", {
      // Report at least 1 online player (the current socket).
      players_online: Math.max(1, duel.sockets.size),
    });

    // Register all duel event handlers for this connected socket.
    registerJoinQueue(socket, duel);
    registerLeaveQueue(socket, duel);
    registerPlayerReady(socket, duel);
    registerSubmitAnswer(socket, duel);
    registerDisconnect(socket, duel);
  });
}
