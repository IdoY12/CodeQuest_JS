import type { Server, Socket } from "socket.io";
import { logInfo } from "../../utils/logger.js";
import { attachDuelConnectionAuthentication } from "./attachDuelConnectionAuthentication.js";
import { registerDisconnect } from "./handlers/disconnect.js";
import { registerJoinQueue } from "./handlers/joinQueue.js";
import { registerLeaveQueue } from "./handlers/leaveQueue.js";
import { registerPlayerReady } from "./handlers/playerReady.js";
import { registerRematchRequest } from "./handlers/rematchRequest.js";
import { registerSubmitAnswer } from "./handlers/submitAnswer.js";

export function attachDuelNamespace(io: Server) {
  const duel = io.of("/duel");
  attachDuelConnectionAuthentication(duel);
  duel.on("connection", (socket: Socket) => {
    logInfo("[DUEL]", "socket:connected", { socketId: socket.id });
    socket.emit("queue_status", {
      players_online: Math.max(1, duel.sockets.size),
    });
    registerJoinQueue(socket, duel);
    registerLeaveQueue(socket, duel);
    registerPlayerReady(socket, duel);
    registerSubmitAnswer(socket, duel);
    registerRematchRequest(socket, duel);
    registerDisconnect(socket, duel);
  });
}
