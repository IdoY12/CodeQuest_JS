/**
 * Boots the CodeQuest Socket.IO duel server with health checks and CORS.
 *
 * Responsibility: HTTP health server, Socket.IO setup, DB connect, duel namespace.
 * Layer: io service entry
 * Depends on: config, @project/db, @project/server-kit, duel namespace
 * Consumers: node dist/index.js in production
 */

import config from "config";
import http from "http";
import { Server } from "socket.io";
import { connectDatabase } from "@project/db";
import { resolveSocketIoCors } from "@project/server-kit/cors";
import { logError, logInfo } from "@project/server-kit/logger";
import { validateIoProductionSecuritySettings } from "@project/server-kit/validateIoSecurity";
import { attachDuelNamespace } from "./socket/duel/index.js";

process.on("unhandledRejection", (reason) => {
  logError("[IO]", reason, { type: "unhandledRejection" });
});
process.on("uncaughtException", (error) => {
  logError("[IO]", error, { type: "uncaughtException" });
});

validateIoProductionSecuritySettings();
await connectDatabase();

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "codequest-io" }));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const io = new Server(server, {
  cors: resolveSocketIoCors(),
});

attachDuelNamespace(io);

const port = Number(config.get<number | string>("app.port"));
const host = config.get<string>("app.host");
server.listen(port, host, () => {
  logInfo("[IO]", "server-started", {
    port,
    host,
    localUrl: `http://localhost:${port}`,
  });
});
