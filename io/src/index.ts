import config from "config";
import http from "http";
import { Server } from "socket.io";
import { connectDatabase } from "@project/db";
import { attachDuelNamespace } from "./socket/duel/index.js";
import { validateProductionSecuritySettings } from "./utils/configValidation.js";
import { logError, logInfo } from "./utils/logger.js";
import { resolveSocketIoCors } from "./utils/runtimeConfig.js";

process.on("unhandledRejection", (reason) => {
  logError("[IO]", reason, { type: "unhandledRejection" });
});
process.on("uncaughtException", (error) => {
  logError("[IO]", error, { type: "uncaughtException" });
});

validateProductionSecuritySettings();
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
