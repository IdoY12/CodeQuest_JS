import type { Socket } from "socket.io";
import { queue } from "../state.js";
import type { DuelNamespace } from "../types.js";

export function registerLeaveQueue(socket: Socket, _duel: DuelNamespace) {
  socket.on("leave_queue", () => {
    const idx = queue.findIndex((entry) => entry.socketId === socket.id);
    if (idx >= 0) queue.splice(idx, 1);
  });
}
