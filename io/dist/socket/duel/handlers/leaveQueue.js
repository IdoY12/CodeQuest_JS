import { queue } from "../state.js";
export function registerLeaveQueue(socket, _duel) {
    socket.on("leave_queue", () => {
        const idx = queue.findIndex((entry) => entry.socketId === socket.id);
        if (idx >= 0)
            queue.splice(idx, 1);
    });
}
